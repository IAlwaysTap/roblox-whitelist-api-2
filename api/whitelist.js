import fs from 'fs';
import path from 'path';

const whitelistPath = path.resolve('./whitelist.txt');

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reason: 'Method not allowed' });
  }

  // Read plain text from body
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const rawBody = Buffer.concat(buffers).toString().trim();

  // Expect format: hwid:ACTION or hwid only
  const [hwid, actionRaw] = rawBody.split(':');
  const action = actionRaw ? actionRaw.trim().toLowerCase() : 'check';

  if (!hwid) {
    return res.status(400).json({ success: false, reason: 'No HWID provided' });
  }

  // Load whitelist from file
  let whitelist = new Set();
  try {
    const data = fs.readFileSync(whitelistPath, 'utf8');
    whitelist = new Set(data.split('\n').filter(Boolean));
  } catch (err) {
    // File may not exist yet
  }

  if (action === 'check') {
    return res.status(200).json({ success: whitelist.has(hwid) });
  }

  if (action === 'add') {
    if (!whitelist.has(hwid)) {
      fs.appendFileSync(whitelistPath, hwid + '\n');
    }
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false, reason: 'Invalid action' });
}
