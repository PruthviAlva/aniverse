// mangaDexService.js — MangaDex API integration
const BASE_URL = "https://api.mangadex.org";

// ─── Helper ────────────────────────────────────────────────
const fetcher = async (url) => {
    const res = await fetch(url, {
        headers: {
            // MangaDex requires this header
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `MangaDex error: ${res.status}`);
    }

    return res.json();
};

// ─── Search manga by title ─────────────────────────────────
export const searchMangaDex = async (title) => {
    // Build URL manually to avoid encoding issues
    const params = new URLSearchParams();
    params.append("title", title);
    params.append("limit", "10");
    params.append("contentRating[]", "safe");
    params.append("contentRating[]", "suggestive");
    params.append("includes[]", "cover_art");
    params.append("order[relevance]", "desc");

    const url = `${BASE_URL}/manga?${params.toString()}`;
    console.log("MangaDex search URL:", url); // debug

    return fetcher(url);
};

// ─── Get chapters for a manga ──────────────────────────────
export const getMangaChapters = async (mangaDexId, page = 1) => {
    const offset = (page - 1) * 40;

    const params = new URLSearchParams();
    params.append("manga", mangaDexId);
    params.append("limit", "40");
    params.append("offset", String(offset));
    params.append("translatedLanguage[]", "en");
    params.append("order[chapter]", "asc");
    params.append("contentRating[]", "safe");
    params.append("contentRating[]", "suggestive");

    const url = `${BASE_URL}/chapter?${params.toString()}`;
    console.log("MangaDex chapters URL:", url); // debug

    return fetcher(url);
};

// ─── Get pages for a chapter ──────────────────────────────
export const getChapterPages = async (chapterId) => {
    const url = `${BASE_URL}/at-home/server/${chapterId}`;

    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
    });

    // Chapter content unavailable (licensed/removed)
    if (res.status === 404) {
        throw new Error("CHAPTER_UNAVAILABLE");
    }

    if (!res.ok) {
        throw new Error(`MangaDex error: ${res.status}`);
    }

    const data = await res.json();
    const { baseUrl, chapter } = data;

    const pages = chapter.data.map(
        (filename) => `${baseUrl}/data/${chapter.hash}/${filename}`
    );

    return { pages, chapterId };
};