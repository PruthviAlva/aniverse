// userService.js — Watchlist and Favorites API calls
const BASE_URL = `${import.meta.env.VITE_API_URL}/api/user`;

// Helper — always attach the auth token
const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("aniverse_token")}`,
});

// ─── Watchlist ────────────────────────────────────────────
export const getWatchlist = async () => {
    const res = await fetch(`${BASE_URL}/watchlist`, { headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
};

export const addToWatchlist = async (animeId, animeTitle, animeCover, status) => {
    const res = await fetch(`${BASE_URL}/watchlist`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ animeId, animeTitle, animeCover, status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
};

export const updateWatchlistStatus = async (animeId, status, progress) => {
    const res = await fetch(`${BASE_URL}/watchlist/${animeId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status, progress }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
};

export const removeFromWatchlist = async (animeId) => {
    const res = await fetch(`${BASE_URL}/watchlist/${animeId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
};

// ─── Favorites ────────────────────────────────────────────
export const getFavorites = async () => {
    const res = await fetch(`${BASE_URL}/favorites`, { headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
};

export const toggleFavorite = async (animeId, animeTitle, animeCover, type = "ANIME") => {
    const res = await fetch(`${BASE_URL}/favorites`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ animeId, animeTitle, animeCover, type }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
};