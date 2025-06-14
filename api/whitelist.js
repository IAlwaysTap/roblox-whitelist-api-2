import fs from 'fs';
import path from 'path';

const whitelistPath = path.resolve('./whitelist.txt');

function loadWhitelist() {
  try {
    const data = fs.readFileSync(whitelistPath, 'utf8');
    return new Set(data.split('\n').filter(Boolean));
  } catch {
    // File doesn't exist or empty
    return new Set();
  }
}

function saveWhitelist(whitelist) {
  fs.writeFileSync(whitelistPath, Array.from(whitelist).join('\n') + '\n', 'utf8');
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reason: 'Method not allowed' });
  }

  const { hwid, action } = req.body;

  if (!hwid) {
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
