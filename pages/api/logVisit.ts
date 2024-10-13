import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the visitor's IP address
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Prepare log data
  const logEntry = `${new Date().toISOString()} - IP: ${ip}\n`;

  // Log to a file
  const logFilePath = path.join(process.cwd(), 'logs', 'visits.log');
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to log visit', err);
      res.status(500).json({ error: 'Failed to log visit' });
    } else {
      res.status(200).json({ message: 'Visit logged' });
    }
  });
}
