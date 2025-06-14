import fs from 'fs';
import path from 'path';

const whitelistPath = path.resolve('./whitelist.txt');

async function readWhitelist() {
  try {
    const data = await fs.promises.readFile(whitelistPath, 'utf8');
    return new Set(data.split('\n').map(line => line.trim()).filter(Boolean));
  } catch (err) {
    if (err.code === 'ENOENT') return new Set(); // file not found = empty set
    throw err;
  }
}

async function writeWhitelist(whitelist) {
  const data = Array.from(whitelist).join('\n') + '\n';
  await fs.promises.writeFile(whitelistPath, data, 'utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reason: 'Method not allowed' });
  }

  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const rawBody = Buffer.concat(buffers).toString().trim();

  // Input format: hwid[:action], e.g. "hwid123:add" or "hwid123"
  const [hwid, actionRaw] = rawBody.split(':');
  const action = actionRaw ? actionRaw.trim().toLowerCase() : 'check';

  if (!hwid) {
    return res.status(400).json({ success: false, reason: 'No HWID provided' });
  }

  try {
    const whitelist = await readWhitelist();

    if (action === 'check') {
      return res.status(200).json({ success: whitelist.has(hwid) });
    }

    if (action === 'add') {
      if (!whitelist.has(hwid)) {
        whitelist.add(hwid);
        await writeWhitelist(whitelist);
      }
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ success: false, reason: 'Invalid action' });
  } catch (error) {
    console.error('Error handling whitelist:', error);
    return res.status(500).json({ success: false, reason: 'Internal server error' });
  }
}
