// userRoutes.js — All user-specific protected routes
const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware.js");
const {
    getWatchlist,
    addToWatchlist,
    updateWatchlistStatus,
    removeFromWatchlist,
    getFavorites,
    toggleFavorite,
} = require("../controllers/userController.js");

const router = Router();

// All routes here require authentication
router.use(authMiddleware);

// Watchlist routes
router.get("/watchlist", getWatchlist);
router.post("/watchlist", addToWatchlist);
router.patch("/watchlist/:animeId", updateWatchlistStatus);
router.delete("/watchlist/:animeId", removeFromWatchlist);

// Favorites routes
router.get("/favorites", getFavorites);
router.post("/favorites", toggleFavorite);

module.exports = router;