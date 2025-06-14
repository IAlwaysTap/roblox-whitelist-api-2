import fs from 'fs';
import path from 'path';

const whitelistPath = path.resolve('./whitelist.txt');

function loadWhitelist() {
  try {
    const data = fs.readFileSync(whitelistPath, 'utf8');
    // Split by newline, filter out empty lines, store in a Set for quick lookup
    return new Set(data.split('\n').filter(Boolean));
  } catch {
    // File doesn't exist or empty
    return new Set();
  }
}

function saveWhitelist(whitelist) {
  // Write all HWIDs, one per line, no quotes or extras, with trailing newline
  fs.writeFileSync(whitelistPath, Array.from(whitelist).join('\n') + '\n', 'utf8');
}

export default function handler(req, res) {
  // CORS headers to allow requests from anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reason: 'Method not allowed' });
  }

  const { hwid, action } = req.body;

  if (!hwid || typeof hwid !== 'string' || hwid.trim() === '') {
    return res.status(400).json({ success: false, reason: 'No HWID provided' });
  }

  const whitelist = loadWhitelist();

  if (action === 'check') {
    if (whitelist.has(hwid)) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, reason: 'Not whitelisted' });
    }
  }

  if (action === 'add') {
    if (!whitelist.has(hwid)) {
      whitelist.add(hwid);
      saveWhitelist(whitelist);
    }
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false, reason: 'Invalid action' });
}
