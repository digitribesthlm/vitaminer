import { connectToDatabase } from '../../../utils/mongodb';
import { verifyAuth } from '../../../utils/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = await verifyAuth(req);
    if (!auth.isAuthenticated) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { supplementId, dosageIndex } = req.body;
    const { db } = await connectToDatabase();

    // Add tracking record
    const result = await db.collection('vitamin_tracking').insertOne({
      userId: new ObjectId(auth.userId),
      supplementId: new ObjectId(supplementId),
      dosageIndex,
      timeStamp: new Date(),
      created_at: new Date(),
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Track supplement error:', error);
    res.status(500).json({ error: 'Failed to track supplement' });
  }
}
