const whitelist = new Set();

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reason: 'Method not allowed' });
  }

  const { hwid, action } = req.body;

  if (!hwid || typeof hwid !== 'string') {
    return res.status(400).json({ success: false, reason: 'Invalid or missing HWID' });
  }

  if (action === 'check') {
    const isWhitelisted = whitelist.has(hwid);
    return res.status(200).json({
      success: isWhitelisted,
      reason: isWhitelisted ? undefined : 'Not whitelisted'
    });
  }

  if (action === 'add') {
    whitelist.add(hwid);
    return res.status(200).json({ success: true });
  }

  if (action === 'remove') {
    const removed = whitelist.delete(hwid);
    return res.status(200).json({
      success: removed,
      reason: removed ? undefined : 'HWID not found'
    });
  }

  return res.status(400).json({ success: false, reason: 'Invalid action' });
}
