import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import { IncomingForm, Fields, Files } from 'formidable';  // Correct import for IncomingForm

// Initialize Cloudinary with environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    return handlePatchRequest(req, res);
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      firstname: user.firstName,
      lastname: user.lastName,
      birthday: user.birthday,
      location: user.location,
      gender: user.gender,
      role: user.role,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Use Formidable to parse the form data
const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  const form = new IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

// Handle PATCH request: Update user details and upload profile picture to Cloudinary
const handlePatchRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse the form data
    const { fields, files } = await parseForm(req);
    const { firstname, lastname, birthday, location, gender } = fields;

    user.firstName = firstname?.toString() || user.firstName;
    user.lastName = lastname?.toString() || user.lastName;
    user.birthday = birthday ? new Date(birthday.toString()) : user.birthday;
    user.location = location?.toString() || user.location;

    // Validate and assign gender value
    if (gender && ['male', 'female', 'other'].includes(gender.toString())) {
      user.gender = gender.toString() as 'male' | 'female' | 'other';
    }

    // If a new profile picture is provided, upload it to Cloudinary
    if (files.profilePicture) {
      const file = Array.isArray(files.profilePicture) ? files.profilePicture[0] : files.profilePicture;
      const uploadResult = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: 'profile_pictures',
      });
      user.profilePicture = uploadResult.secure_url;
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
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
