const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Load environment variables from .env file
require("dotenv").config();

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const app = express();

// -------Security-------------
// Helmet automatically sets safe HTTP response headers
app.use(helmet());

// CORS: only allow requests from our React frontend
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// Rate limiter: max 100 requests per IP per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later." }
});

app.use("/api", limiter);

// ─── General Middleware ────────────────────────────────────
// Parse incoming JSON bodies
app.use(express.json());

// Log requests in development (GET /api/health 200 2ms)
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// ─── Routes ───────────────────────────────────────────────
// Health check — confirms the server is alive
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "AniVerse API is running 🎌",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────
// Must have 4 params so Express knows it's an error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
    });
});

module.exports = app;