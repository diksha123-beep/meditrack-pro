const express = require("express");
const { login, register, getProfile } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/login — public
router.post("/login", login);

// POST /api/auth/register — public (for initial setup)
router.post("/register", register);

// GET /api/auth/me — protected
router.get("/me", authenticateToken, getProfile);

module.exports = router;
