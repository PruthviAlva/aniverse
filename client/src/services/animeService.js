// animeService.js — All Jikan API calls live here
// Docs: https://docs.api.jikan.moe

const BASE_URL = "https://api.jikan.moe/v4";

// ─── Helper ────────────────────────────────────────────────
// Central fetch function — handles errors in one place
export const fetcher = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Jikan API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

// ─── Anime Endpoints ───────────────────────────────────────

// Get currently airing / trending anime
export const getTrendingAnime = () => fetcher("/top/anime?filter=airing&limit=12");

// Get top anime of all time
export const getTopAnime = () =>
    fetcher("/top/anime?limit=12");

// Get seasonal anime (current season)
export const getSeasonalAnime = () =>
    fetcher("/seasons/now?limit=12");

// Get a single anime by its MAL ID
export const getAnimeById = (id) =>
    fetcher(`/anime/${id}/full`);

// Search anime by keyword
export const searchAnime = (query) =>
    fetcher(`/anime?q=${encodeURIComponent(query)}&limit=12`);

// Get top manga
export const getTopManga = () =>
    fetcher("/top/manga?limit=12");
