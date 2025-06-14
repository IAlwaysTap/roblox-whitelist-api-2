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

  // Example whitelist (replace with real storage)
  const whitelist = new Set([
    "eec44867-c4e7-4449-bae2-4c16eb101c58",
    "sample-hwid-2"
  ]);

  if (action === 'check') {
    return res.status(200).json({ success: whitelist.has(hwid) });
  }

  if (action === 'add') {
    whitelist.add(hwid);
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false, reason: 'Invalid action' });
}
