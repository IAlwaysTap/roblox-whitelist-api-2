import fs from 'fs';
import path from 'path';

const whitelistPath = path.resolve('./whitelist.txt');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reason: 'Method not allowed' });
  }

  const { hwid, action } = req.body;

  if (!hwid) {
    return res.status(400).json({ success: false, reason: 'No HWID provided' });
  }

  // Load existing HWIDs from file
  let whitelist = new Set();
  try {
    const data = fs.readFileSync(whitelistPath, 'utf8');
    whitelist = new Set(data.split('\n').filter(Boolean));
  } catch (err) {
    // If file doesn't exist, create it later
  }

  if (action === 'check') {
    if (whitelist.has(hwid)) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, reason: 'Not whitelisted' });
    }
  }

  if (action === 'add') {
    if (!whitelist.has(hwid)) {
      fs.appendFileSync(whitelistPath, `${hwid}\n`);
    }
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false, reason: 'Invalid action' });
}
