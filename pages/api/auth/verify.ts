// pages/api/auth/verify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';

const verify = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === 'POST') {
    const { userId, verificationCode } = req.body;

    if (!userId || !verificationCode) {
      return res.status(400).json({ success: false, message: 'Missing userId or verificationCode' });
    }

    try {
      // Find the user by ID
      const user = await User.findById(userId);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Check if the verification code matches
      if (user.verificationCode === verificationCode) {
        user.isVerified = true;
        user.verificationCode = undefined; // Clear the verification code after successful verification
        await user.save();

        return res.status(200).json({ success: true, message: 'Email verified successfully' });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid verification code' });
      }
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};

export default verify;
