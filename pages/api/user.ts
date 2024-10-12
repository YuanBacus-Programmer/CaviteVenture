import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { Request, Response } from 'express'; // Importing types for Express

// Multer setup for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Custom type for the Next.js API handler with Express Request and Response
interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

// Helper function to run middleware manually
const runMiddleware = (
  req: Request,  // Express Request
  res: Response, // Express Response
  fn: (req: Request, res: Response, callback: (result: unknown) => void) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve();
    });
  });
};

const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Disable the default Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'PATCH') {
    // Cast req and res to unknown first and then Express Request/Response for multer
    await runMiddleware(req as unknown as Request, res as unknown as Response, upload.single('profilePicture'));
    return handlePatchRequest(req as NextApiRequestWithFile, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Handle GET request: Fetch user details
const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Fetch user details using the userId from the decoded token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile details
    return res.status(200).json({
      firstname: user.firstName,
      lastname: user.lastName,
      birthday: user.birthday,
      location: user.location,
      gender: user.gender,
      role: user.role,
      email: user.email,
      profilePicture: user.profilePicture, // Include profile picture URL
    });
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Handle PATCH request: Update user details
const handlePatchRequest = async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Find user by userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields from request body
    const { firstname, lastname, birthday, location, gender } = req.body;

    user.firstName = firstname || user.firstName;
    user.lastName = lastname || user.lastName;
    user.birthday = birthday || user.birthday;
    user.location = location || user.location;
    user.gender = gender || user.gender;

    // If a new profile picture is uploaded, update it
    if (req.file) {
      const profilePicturePath = `/uploads/${req.file.filename}`;
      user.profilePicture = profilePicturePath;
    }

    // Save updated user information to the database
    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        firstname: user.firstName,
        lastname: user.lastName,
        birthday: user.birthday,
        location: user.location,
        gender: user.gender,
        role: user.role,
        email: user.email,
        profilePicture: user.profilePicture, // Include updated profile picture
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
