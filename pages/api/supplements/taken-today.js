import { connectToDatabase } from '../../../utils/mongodb';
import { verifyAuth } from '../../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const auth = await verifyAuth(req);
  if (!auth.isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { db } = await connectToDatabase();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all supplements taken today
    const takenToday = await db
      .collection('vitamin_tracking')
      .find({
        userId: auth.userId,
        timeStamp: { $gte: today },
      })
      .toArray();

    res.status(200).json(takenToday);
  } catch (error) {
    console.error('Failed to fetch taken supplements:', error);
    res.status(500).json({ error: 'Failed to fetch taken supplements' });
  }
}
