// pages/api/signin.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare hashed password with the stored password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        token,
        user: {
          firstname: user.firstName,
          lastname: user.lastName,
          birthday: user.birthday,
          location: user.location,
          gender: user.gender,
          role: user.role,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Sign-in error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
