// mangaDexService.js — MangaDex API integration
// Docs: https://api.mangadex.org/docs
const BASE_URL = "https://api.mangadex.org";
const IMAGE_URL = "https://uploads.mangadex.org";

// ─── Helper ────────────────────────────────────────────────
const fetcher = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "MangaDex API error");
    return data;
};

// ─── Search manga by title ─────────────────────────────────
export const searchMangaDex = async (title) => {
    const query = encodeURIComponent(title);
    return fetcher(
        `/manga?title=${query}&limit=5&contentRating[]=safe` +
        `&contentRating[]=suggestive&includes[]=cover_art`
    );
};

// ─── Get chapters for a manga ─────────────────────────────
export const getMangaChapters = async (mangaDexId, page = 1) => {
    const offset = (page - 1) * 40;
    return fetcher(
        `/chapter?manga=${mangaDexId}&limit=40&offset=${offset}` +
        `&translatedLanguage[]=en&order[chapter]=asc` +
        `&contentRating[]=safe&contentRating[]=suggestive`
    );
};

// ─── Get pages for a chapter ──────────────────────────────
export const getChapterPages = async (chapterId) => {
    const data = await fetcher(`/at-home/server/${chapterId}`);

    // Build full image URLs from the response
    const { baseUrl, chapter } = data;
    const pages = chapter.data.map(
        (filename) => `${baseUrl}/data/${chapter.hash}/${filename}`
    );

    return { pages, chapterId };
};