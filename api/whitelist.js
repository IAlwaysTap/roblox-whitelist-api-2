export default async function handler(req, res) {
  const { hwid, action } = req.body;

  if (!hwid || !action) {
    return res.status(400).json({ success: false, reason: "HWID or action missing" });
  }

  global.whitelist = global.whitelist || new Set(["sample-hwid-1"]);

  if (action === "check") {
    const isWhitelisted = global.whitelist.has(hwid);
    return res.json({ success: isWhitelisted });
  }

  if (action === "add") {
    global.whitelist.add(hwid);
    return res.json({ success: true });
  }

  return res.status(400).json({ success: false, reason: "Invalid action" });
}
