import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import mongoose from 'mongoose';

// Define the Event schema for pending events
const eventSchema = new mongoose.Schema({
  image: String,
  title: String,
  location: String,
  date: String,
  description: String,
  approved: { type: Boolean, default: false }, // Not approved by default
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure DB connection

  switch (req.method) {
    case 'GET':
      return getPendingEvents(req, res);
    case 'PATCH':
      return approvePendingEvent(req, res);
    case 'DELETE':
      return deletePendingEvent(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Fetch all pending events
async function getPendingEvents(req: NextApiRequest, res: NextApiResponse) {
  try {
    const events = await Event.find({ approved: false });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending events', error });
  }
}

// Approve an event
async function approvePendingEvent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Mark the event as approved
    event.approved = true;
    await event.save();

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Error approving event', error });
  }
}

// Delete a pending event
async function deletePendingEvent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting event', error });
  }
}
