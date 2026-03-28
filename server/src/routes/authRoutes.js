// authRoutes.js — Auth endpoints
const { Router } = require("express");
const { register, login, getMe } = require("../controllers/authController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = Router();

// Public routes — no token needed
router.post("/register", register);
router.post("/login", login);

// Protected route — token required
// authMiddleware runs first, then getMe
router.get("/me", authMiddleware, getMe);

module.exports = router;