// youtubeService.js — Searches YouTube for Muse Asia anime episodes
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// ─── Search for episodes ───────────────────────────────────
export const searchMuseAsiaEpisodes = async (animeTitle, maxResults = 12) => {
    // Search specifically on Muse Asia's channel for full episodes
    const query = encodeURIComponent(
        `${animeTitle} Muse Asia full episode`
    );

    const url = `${BASE_URL}/search?part=snippet&q=${query}` +
        `&type=video&maxResults=${maxResults}` +
        `&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error?.message || "YouTube API error");
    }

    return data.items || [];
};

// ─── Search for a specific episode number ─────────────────
export const searchEpisode = async (animeTitle, episodeNumber) => {
    const query = encodeURIComponent(
        `${animeTitle} episode ${episodeNumber} Muse Asia`
    );

    const url = `${BASE_URL}/search?part=snippet&q=${query}` +
        `&type=video&maxResults=5` +
        `&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error?.message || "YouTube API error");
    }

    return data.items || [];
};