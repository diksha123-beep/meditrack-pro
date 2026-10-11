const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Import routes
const equipmentRoutes = require("./routes/equipmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const authRoutes = require("./routes/authRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Import auth middleware
const { authenticateToken } = require("./middleware/authMiddleware");

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("MediTrack Pro Backend is running!");
});

// ── Public routes (no JWT required) ──
app.use("/api/auth", authRoutes);

// ── Protected routes (JWT required) ──
app.use("/api/equipment", authenticateToken, equipmentRoutes);
app.use("/api/notifications", authenticateToken, notificationRoutes);
app.use("/api/maintenance", authenticateToken, maintenanceRoutes);
app.use("/api/dashboard", authenticateToken, dashboardRoutes);

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`MediTrack Pro server running on http://localhost:${PORT}`);
});