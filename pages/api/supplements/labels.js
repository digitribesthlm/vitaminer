import { connectToDatabase } from '../../../utils/mongodb';
import { verifyAuth } from '../../../utils/auth';

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
    const labels = await db.collection('vitamin_labels').find({}).toArray();

    res.status(200).json(labels);
  } catch (error) {
    console.error('Failed to fetch labels:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
