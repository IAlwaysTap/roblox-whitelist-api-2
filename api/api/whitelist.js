let whitelist = new Set();

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, reason: "Only POST supported" });
  }

  const { hwid, action } = req.body;

  if (!hwid || !action) {
    return res.status(400).json({ success: false, reason: "HWID or action missing" });
  }

  if (action === "add") {
    whitelist.add(hwid);
    return res.json({ success: true });
  }

  if (action === "check") {
    return res.json({ success: whitelist.has(hwid) });
  }

  return res.status(400).json({ success: false, reason: "Invalid action" });
}
