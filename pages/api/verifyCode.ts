import { NextApiRequest, NextApiResponse } from 'next';
import { readCodes, writeCodes } from '../../utils/codeStorage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    // Read the stored verification codes from the file
    const verificationCodes = await readCodes();
    const storedCodeData = verificationCodes[email.toLowerCase()];

    if (!storedCodeData) {
      return res.status(400).json({ message: 'No verification code found for this email' });
    }

    const { code: storedCode, expiresAt } = storedCodeData;

    if (Date.now() > expiresAt) {
      // Delete the expired code
      delete verificationCodes[email.toLowerCase()];
      await writeCodes(verificationCodes);
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    if (storedCode === code) {
      // Delete the code after successful verification
      delete verificationCodes[email.toLowerCase()];
      await writeCodes(verificationCodes);

      return res.status(200).json({ message: 'Code verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
