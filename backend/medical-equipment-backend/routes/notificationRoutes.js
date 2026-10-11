const express = require("express");
const { getNotifications, markRead, markAllRead } = require("../controllers/notificationController");
const router = express.Router();
router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markRead);
module.exports = router;
