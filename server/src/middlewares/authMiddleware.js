// authMiddleware.js — Protects routes that require login
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Token comes in the Authorization header as "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No token provided" });
    }

    // Extract the token part after "Bearer "
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user data to the request object
        // Now any route after this middleware can access req.user
        req.user = decoded;

        next(); // move to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;