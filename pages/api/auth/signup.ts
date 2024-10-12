// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import sendEmail from '@/utils/sendEmail';
import { nanoid } from 'nanoid';

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === 'POST') {
    const { firstName, lastName, birthday, gender, location, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = nanoid(6);

      const newUser = new User({
        firstName,
        lastName,
        birthday,
        gender,
        location,
        email,
        password: hashedPassword,
        role: 'user',
        verificationCode,
        isVerified: false,
      });

      await newUser.save();

      await sendEmail({
        to: email,
        subject: 'Verify your email',
        text: `Your verification code is: ${verificationCode}`,
      });

      res.status(201).json({ success: true, userId: newUser._id });
    } catch (error) {
      console.error('Signup error:', error); // Log the error to handle it properly
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};

export default signup;
