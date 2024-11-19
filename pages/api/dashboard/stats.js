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

    const { db } = await connectToDatabase()

    const totalSupplements = await db
      .collection('vitamin_supplements')
      .countDocuments({ userId: new ObjectId(auth.userId) })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const takenToday = await db.collection('vitamin_tracking').countDocuments({
      userId: new ObjectId(auth.userId),
      timeStamp: { $gte: today }
    })

    res.status(200).json({
      totalSupplements,
      takenToday,
      streak: 0
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
}
