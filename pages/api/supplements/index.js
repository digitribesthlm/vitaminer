import { connectToDatabase } from '../../../utils/mongodb';
import { verifyAuth } from '../../../utils/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (!auth.isAuthenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const supplements = await db
        .collection('vitamin_supplements')
        .find({ userId: new ObjectId(auth.userId) })
        .toArray();
      
      res.status(200).json(supplements);
    } catch (error) {
      console.error('Fetch supplements error:', error);
      res.status(500).json({ error: 'Failed to fetch supplements' });
    }
  } 
  else if (req.method === 'POST') {
    try {
      const supplement = {
        ...req.body,
        userId: new ObjectId(auth.userId),
        labelIds: req.body.labelIds.map(id => new ObjectId(id)),
        created_at: new Date()
      };

      const result = await db
        .collection('vitamin_supplements')
        .insertOne(supplement);
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Add supplement error:', error);
      res.status(500).json({ error: 'Failed to add supplement' });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 