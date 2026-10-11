const db = require("../db");
exports.getNotifications = (req, res) => {
  db.query("SELECT id, equipment_id, title, message, type, is_read, created_at FROM notifications ORDER BY created_at DESC, id DESC LIMIT 100", (err, rows) => {
    if (err) return res.status(500).json({ message: "Could not load notifications", detail: err.message });
    res.json({ notifications: rows, unreadCount: rows.filter(n => !n.is_read).length });
  });
};
exports.markRead = (req, res) => db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id], (err) => err ? res.status(500).json({message:"Could not update notification"}) : res.json({message:"Notification marked as read"}));
exports.markAllRead = (req, res) => db.query("UPDATE notifications SET is_read = 1 WHERE is_read = 0", (err) => err ? res.status(500).json({message:"Could not update notifications"}) : res.json({message:"All notifications marked as read"}));
