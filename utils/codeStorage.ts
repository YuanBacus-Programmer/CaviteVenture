import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'verificationCodes.json');

// Read verification codes from file
export async function readCodes(): Promise<{ [email: string]: { code: string; expiresAt: number } }> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // If file doesn't exist, return an empty object
    return {};
  }
}

// Write verification codes to file
export async function writeCodes(codes: { [email: string]: { code: string; expiresAt: number } }): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(codes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing verification codes to file:', err);
  }
}
