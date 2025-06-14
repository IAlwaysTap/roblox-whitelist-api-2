export default async function handler(req, res) {
  const { hwid, action } = req.body;

  if (!hwid || !action) {
    return res.status(400).json({ success: false, reason: "HWID or action missing" });
  }

  // Simulated database (resets on deploy)
  global.whitelist = global.whitelist || new Set(["test-hwid"]);

  if (action === "check") {
    const isWhitelisted = global.whitelist.has(hwid);
    return res.json({ success: isWhitelisted });
  }

  if (action === "add") {
    global.whitelist.add(hwid);
    return res.json({ success: true });
  }

  res.status(400).json({ success: false, reason: "Invalid action" });
}
