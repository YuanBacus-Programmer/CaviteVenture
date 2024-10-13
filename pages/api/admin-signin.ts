// Next.js API Route for Admin Sign-in
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined. Set it in the environment variables.');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the user has the 'admin' role
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins are allowed.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      JWT_SECRET as string, // Use type assertion to ensure JWT_SECRET is a string
      { expiresIn: '1h' }
    );

    // Return the token and user details
    return res.status(200).json({
      token,
      user: {
        firstname: user.firstName,
        lastname: user.lastName,
        birthday: user.birthday,
        location: user.location,
        gender: user.gender,
        role: user.role, // Include role in the response
        email: user.email,
      },
    });
  } catch (error) {
    console.error('admin sign-in error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}