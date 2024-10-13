import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const visitFilePath = path.join(process.cwd(), 'logs', 'visitCount.json');

function getVisitCount() {
  if (fs.existsSync(visitFilePath)) {
    const data = fs.readFileSync(visitFilePath, 'utf8');
    return JSON.parse(data).count;
  }
  return 0;
}

function incrementVisitCount() {
  let currentCount = getVisitCount();
  currentCount += 1;
  fs.writeFileSync(visitFilePath, JSON.stringify({ count: currentCount }), 'utf8');
  return currentCount;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const count = getVisitCount();
    res.status(200).json({ count });
  } else if (req.method === 'POST') {
    const updatedCount = incrementVisitCount();
    res.status(200).json({ count: updatedCount });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
