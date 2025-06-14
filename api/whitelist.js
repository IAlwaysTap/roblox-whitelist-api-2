export default function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reason: 'Method not allowed' });
  }

  const { hwid, action } = req.body;

  if (!hwid) {
    return res.status(400).json({ success: false, reason: 'No HWID provided' });
  }

  // Example whitelist stored in memory
  // In production, replace with DB or persistent storage
  const whitelist = new Set([
    "sample-hwid-1",
    "sample-hwid-2"
  ]);

  if (action === 'check') {
    if (whitelist.has(hwid)) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, reason: 'Not whitelisted' });
    }
  }

  if (action === 'add') {
    whitelist.add(hwid);
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false, reason: 'Invalid action' });
}
