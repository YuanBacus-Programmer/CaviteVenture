import { NextApiRequest, NextApiResponse } from 'next';
import sendEmail from '../../utils/sendEmail';
import { readCodes, writeCodes } from '../../utils/codeStorage';

// Generate a random verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const verificationCode = generateVerificationCode();

    // Read the existing codes
    const verificationCodes = await readCodes();

    // Store the verification code with an expiration time (e.g., 10 minutes)
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    verificationCodes[email.toLowerCase()] = { code: verificationCode, expiresAt };

    // Write the updated codes back to the file
    await writeCodes(verificationCodes);

    try {
      // Send the verification email
      await sendEmail({
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${verificationCode}`,
      });

      return res.status(200).json({ message: 'Verification code sent' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
