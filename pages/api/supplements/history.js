import { connectToDatabase } from '../../../utils/mongodb'
import { verifyAuth } from '../../../utils/auth'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const auth = await verifyAuth(req)
    if (!auth.isAuthenticated) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { range = 'week' } = req.query
    const { db } = await connectToDatabase()

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get tracking history with supplement details
    const history = await db
      .collection('vitamin_tracking')
      .aggregate([
        {
          $match: {
            userId: new ObjectId(auth.userId),
            timeStamp: { $gte: startDate }
          }
        },
        {
          $lookup: {
            from: 'vitamin_supplements',
            localField: 'supplementId',
            foreignField: '_id',
            as: 'supplement'
          }
        },
        {
          $unwind: '$supplement'
        },
        {
          $project: {
            supplementId: 1,
            timeStamp: 1,
            dosageIndex: 1,
            supplementName: '$supplement.name',
            dosages: '$supplement.dosages',
            category: '$supplement.category'
          }
        },
        {
          $sort: { timeStamp: -1 }
        }
      ])
      .toArray()

    res.status(200).json(history)
  } catch (error) {
    console.error('History fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch history' })
  }
}
