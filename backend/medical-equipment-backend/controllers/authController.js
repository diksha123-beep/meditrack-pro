const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "mediequip_fallback_secret";
const TOKEN_EXPIRY = "24h";

/**
 * POST /api/auth/login
 * Authenticates user with username and password, returns JWT.
 */
const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    db.query(
        "SELECT id, username, email, password_hash, full_name, role FROM users WHERE username = ? OR email = ?",
        [username, username],
        async (err, results) => {
            if (err) {
                console.error("Login query error:", err.message);
                return res.status(500).json({ message: "Server error during login." });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid username or password." });
            }

            const user = results[0];

            try {
                const isMatch = await bcrypt.compare(password, user.password_hash);

                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid username or password." });
                }

                const tokenPayload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.full_name,
                    role: user.role,
                };

                const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

                res.json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        fullName: user.full_name,
                        role: user.role,
                    },
                });
            } catch (bcryptErr) {
                console.error("Bcrypt error:", bcryptErr.message);
                return res.status(500).json({ message: "Server error during authentication." });
            }
        }
    );
};

/**
 * POST /api/auth/register
 * Creates a new user account with hashed password.
 */
const register = (req, res) => {
    const { username, email, password, fullName, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    db.query(
        "SELECT id FROM users WHERE username = ? OR email = ?",
        [username, email],
        async (err, existing) => {
            if (err) {
                console.error("Registration check error:", err.message);
                return res.status(500).json({ message: "Server error during registration." });
            }

            if (existing.length > 0) {
                return res.status(409).json({ message: "Username or email already exists." });
            }

            try {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);

                db.query(
                    "INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)",
                    [username, email, passwordHash, fullName || "", role || "admin"],
                    (insertErr, result) => {
                        if (insertErr) {
                            console.error("Registration insert error:", insertErr.message);
                            return res.status(500).json({ message: "Could not create user account." });
                        }

                        res.status(201).json({
                            message: "User registered successfully",
                            userId: result.insertId,
                        });
                    }
                );
            } catch (hashErr) {
                console.error("Hashing error:", hashErr.message);
                return res.status(500).json({ message: "Server error creating account." });
            }
        }
    );
};

/**
 * GET /api/auth/me
 * Returns the current user's profile (requires valid JWT).
 */
const getProfile = (req, res) => {
    res.json({ user: req.user });
};

module.exports = { login, register, getProfile };
