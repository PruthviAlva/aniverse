// authController.js — Handles register, login, and get current user
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db.js");

// ─── Helper: generate JWT token ────────────────────────────
const generateToken = (user) => {
    return jwt.sign(
        // Payload — data stored inside the token
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

// ─── Register ──────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Basic validation
        if (!email || !username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters"
            });
        }

        // Check if email or username already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                error: existingUser.email === email
                    ? "Email already in use"
                    : "Username already taken"
            });
        }

        // Hash the password — never store plain text passwords
        // 10 = salt rounds (higher = more secure but slower)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await prisma.user.create({
            data: { email, username, password: hashedPassword },
        });

        // Generate JWT token
        const token = generateToken(user);

        // Return user data (without password) + token
        res.status(201).json({
            message: "Account created successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
            },
        });

    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// ─── Login ─────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Don't reveal whether email exists — generic message
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare the input password against the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
            },
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// ─── Get Current User ──────────────────────────────────────
// GET /api/auth/me  (protected route)
const getMe = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            // Never return the password field
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        console.error("GetMe error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { register, login, getMe };