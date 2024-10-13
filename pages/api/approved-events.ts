import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import mongoose from 'mongoose';

// Define the ApprovedEvent schema
const approvedEventSchema = new mongoose.Schema({
  image: String,
  title: String,
  location: String,
  date: String,
  description: String,
  approved: { type: Boolean, default: true }, // Approved by default
  createdAt: { type: Date, default: Date.now },
});

const ApprovedEvent = mongoose.models.ApprovedEvent || mongoose.model('ApprovedEvent', approvedEventSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      return postApprovedEvent(req, res);
    case 'GET':
      return getApprovedEvents(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// POST method: Save an approved event to the ApprovedEvent collection
async function postApprovedEvent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { image, title, location, date, description } = req.body;

    const newApprovedEvent = new ApprovedEvent({
      image,
      title,
      location,
      date,
      description,
    });

    const savedEvent = await newApprovedEvent.save();
    res.status(201).json({ message: 'Event approved and saved', eventId: savedEvent._id });
  } catch (error) {
    res.status(500).json({ message: 'Error saving approved event', error });
  }
}

// GET method: Fetch all approved events from the ApprovedEvent collection
async function getApprovedEvents(req: NextApiRequest, res: NextApiResponse) {
  try {
    const approvedEvents = await ApprovedEvent.find({});
    res.status(200).json(approvedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved events', error });
  }
}
