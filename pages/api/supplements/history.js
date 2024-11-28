import { connectToDatabase } from '../../../utils/mongodb';
import { verifyAuth } from '../../../utils/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = await verifyAuth(req);
    if (!auth.isAuthenticated) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { db } = await connectToDatabase();

    // First, let's log the raw tracking data
    const rawTracking = await db
      .collection('vitamin_tracking')
      .find({
        userId: new ObjectId(auth.userId),
      })
      .toArray();
    
    console.log('Raw tracking data:', JSON.stringify(rawTracking, null, 2));

    // Get tracking history with supplement details
    const history = await db
      .collection('vitamin_tracking')
      .aggregate([
        {
          $match: {
            userId: new ObjectId(auth.userId),
          },
        },
        {
          $lookup: {
            from: 'vitamin_supplements',
            localField: 'supplementId',
            foreignField: '_id',
            as: 'supplement',
          },
        },
        {
          $unwind: {
            path: '$supplement',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $addFields: {
            dateString: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$timeStamp',
              },
            },
          },
        },
        {
          $group: {
            _id: '$dateString',
            supplements: {
              $push: {
                name: '$supplement.name',
                amount: {
                  $let: {
                    vars: {
                      dosage: { $arrayElemAt: ['$supplement.dosages', '$dosageIndex'] }
                    },
                    in: '$$dosage.amount'
                  }
                },
                unit: {
                  $let: {
                    vars: {
                      dosage: { $arrayElemAt: ['$supplement.dosages', '$dosageIndex'] }
                    },
                    in: '$$dosage.unit'
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            supplements: 1
          }
        },
        {
          $sort: { date: -1 },
        },
      ])
      .toArray();

    // Log the processed history data
    console.log('Processed history data:', JSON.stringify(history, null, 2));

    // Log the supplement IDs we're working with
    const supplementIds = rawTracking.map(t => t.supplementId);
    const supplements = await db
      .collection('vitamin_supplements')
      .find({
        _id: { $in: supplementIds.map(id => new ObjectId(id)) }
      })
      .toArray();
    
    console.log('Found supplements:', JSON.stringify(supplements, null, 2));

    res.status(200).json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}
