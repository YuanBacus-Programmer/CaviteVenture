import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect'; // Adjust the import path based on your project structure
import User from '@/models/User';

interface StatisticsResponse {
  totalUsers: number;
  male: number;
  female: number;
  other: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<StatisticsResponse | { error: string }>) {
  try {
    await dbConnect();

    const totalUsers = await User.countDocuments();
    const maleCount = await User.countDocuments({ gender: 'male' });
    const femaleCount = await User.countDocuments({ gender: 'female' });
    const otherCount = await User.countDocuments({ gender: 'other' });

    res.status(200).json({
      totalUsers,
      male: maleCount,
      female: femaleCount,
      other: otherCount,
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
}
