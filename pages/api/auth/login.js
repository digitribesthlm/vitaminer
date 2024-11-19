// pages/api/auth/login.js
import { connectToDatabase } from '../../../utils/mongodb'
import { serialize } from 'cookie'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body
    console.log('Attempting login for email:', email)

    const { db } = await connectToDatabase()

    const collections = await db.listCollections().toArray()
    console.log(
      'Available collections:',
      collections.map((c) => c.name)
    )

    const users = await db.collection('vitamine_users').find({}).toArray()
    console.log('Total users in collection:', users.length)

    const user = await db.collection('vitamine_users').findOne({ email })
    console.log('User found:', user ? 'yes' : 'no')

    if (!user) {
      console.error('Login failed: User not found')
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (password !== user.password) {
      console.error('Login failed: Invalid password')
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = Buffer.from(
      JSON.stringify({
        userId: user._id.toString(),
        email: user.email,
        role: user.role || 'user'
      })
    ).toString('base64')

    res.setHeader(
      'Set-Cookie',
      serialize('auth-token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
    )

    console.log('Login successful for:', email)

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        email: user.email,
        role: user.role || 'user'
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
