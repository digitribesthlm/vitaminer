import { connectToDatabase } from '../../../utils/mongodb';
import { verifyAuth } from '../../../utils/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (!auth.isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const { db } = await connectToDatabase();

  if (req.method === 'PUT') {
    try {
      const result = await db.collection('vitamin_supplements').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...req.body,
            updated_at: new Date()
          }
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Supplement not found' });
      }

      res.status(200).json({ message: 'Supplement updated successfully' });
    } catch (error) {
      console.error('Update supplement error:', error);
      res.status(500).json({ error: 'Failed to update supplement' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 