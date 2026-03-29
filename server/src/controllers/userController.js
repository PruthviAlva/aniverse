// userController.js — Watchlist and Favorites logic
const prisma = require("../config/db.js");

// ─── Get user's watchlist ──────────────────────────────────
// GET /api/user/watchlist
const getWatchlist = async (req, res) => {
    try {
        const watchlist = await prisma.watchlist.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
        });

        res.json({ watchlist });
    } catch (err) {
        console.error("getWatchlist error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// ─── Add anime to watchlist ────────────────────────────────
// POST /api/user/watchlist
const addToWatchlist = async (req, res) => {
    try {
        const { animeId, animeTitle, animeCover, status } = req.body;

        if (!animeId || !animeTitle) {
            return res.status(400).json({ error: "animeId and animeTitle are required" });
        }

        // upsert = update if exists, create if not
        const item = await prisma.watchlist.upsert({
            where: {
                userId_animeId: { userId: req.user.id, animeId: Number(animeId) }
            },
            update: { status: status || "PLANNING", animeCover },
            create: {
                userId: req.user.id,
                animeId: Number(animeId),
                animeTitle,
                animeCover,
                status: status || "PLANNING",
            },
        });

        res.status(201).json({ message: "Added to watchlist", item });

    } catch (err) {
        console.error("addToWatchlist error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// ─── Update watchlist status ───────────────────────────────
// PATCH /api/user/watchlist/:animeId
const updateWatchlistStatus = async (req, res) => {
    try {
        const { status, progress } = req.body;
        const animeId = Number(req.params.animeId);

        const item = await prisma.watchlist.update({
            where: {
                userId_animeId: { userId: req.user.id, animeId }
            },
            data: {
                ...(status && { status }),
                ...(progress !== undefined && { progress: Number(progress) }),
            },
        });

        res.json({ message: "Watchlist updated", item });
    } catch (err) {
        console.error("updateWatchlist error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Remove from watchlist ────────────────────────────────
// DELETE /api/user/watchlist/:animeId
const removeFromWatchlist = async (req, res) => {
    try {
        const animeId = Number(req.params.animeId);

        await prisma.watchlist.delete({
            where: {
                userId_animeId: { userId: req.user.id, animeId }
            },
        });

        res.json({ message: "Removed from watchlist" });
    } catch (err) {
        console.error("removeFromWatchlist error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Get user's favorites ─────────────────────────────────
// GET /api/user/favorites
const getFavorites = async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
        });

        res.json({ favorites });
    } catch (err) {
        console.error("getFavorites error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ─── Toggle favorite ──────────────────────────────────────
// POST /api/user/favorites
const toggleFavorite = async (req, res) => {
    try {
        const { animeId, animeTitle, animeCover, type } = req.body;

        if (!animeId || !animeTitle) {
            return res.status(400).json({ error: "animeId and animeTitle are required" });
        }

        const favoriteType = type || "ANIME";

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_animeId_type: {
                    userId: req.user.id,
                    animeId: Number(animeId),
                    type: favoriteType,
                }
            },
        });

        if (existing) {
            // Already favorited — remove it (toggle off)
            await prisma.favorite.delete({ where: { id: existing.id } });
            return res.json({ message: "Removed from favorites", favorited: false });
        }

        // Not favorited — add it (toggle on)
        await prisma.favorite.create({
            data: {
                userId: req.user.id,
                animeId: Number(animeId),
                animeTitle,
                animeCover,
                type: favoriteType,
            },
        });

        res.status(201).json({ message: "Added to favorites", favorited: true });
    } catch (err) {
        console.error("toggleFavorite error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    updateWatchlistStatus,
    removeFromWatchlist,
    getFavorites,
    toggleFavorite,
};