import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/utils/dbConnect' // Adjust the import path based on your project structure
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure a connection to the database

  if (req.method === 'POST') {
    try {
      const { image, title, location, date, description } = req.body;

      // Define a new event schema or use an existing one if you have it
      const eventSchema = new mongoose.Schema({
        image: String,
        title: String,
        location: String,
        date: String,
        description: String,
        approved: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      });

      const EventModel = mongoose.models.Event || mongoose.model('Event', eventSchema);

      const newEvent = new EventModel({
        image,
        title,
        location,
        date,
        description,
      });

      // Save the new event to the database
      const savedEvent = await newEvent.save();

      return res.status(201).json({ message: 'Event submitted for approval', eventId: savedEvent._id });
    } catch (error) {
      console.error('Error saving event:', error);
      return res.status(500).json({ message: 'Error saving event', error });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
