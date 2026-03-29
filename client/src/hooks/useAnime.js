// useAnime.js — Custom hook that wraps TanStack Query for anime data
import { useQuery } from "@tanstack/react-query";
import {
    getTrendingAnime,
    getTopAnime,
    getSeasonalAnime,
    getAnimeById,
    searchAnime,
    getTopManga,
    getMangaById,
    getMangaCharacters
} from "../services/animeService";

// ─── Hook: Trending Anime ──────────────────────────────────
export const useTrendingAnime = () => {
    return useQuery({
        queryKey: ["trending-anime"],   // unique cache key
        queryFn: getTrendingAnime,
        staleTime: 1000 * 60 * 5,      // cache for 5 minutes
    });
};

// ─── Hook: Top Anime ──────────────────────────────────────
export const useTopAnime = () => {
    return useQuery({
        queryKey: ["top-anime"],
        queryFn: getTopAnime,
        staleTime: 1000 * 60 * 10,     // cache for 10 minutes
    });
};

// ─── Hook: Seasonal Anime ─────────────────────────────────
export const useSeasonalAnime = () => {
    return useQuery({
        queryKey: ["seasonal-anime"],
        queryFn: getSeasonalAnime,
        staleTime: 1000 * 60 * 5,
    });
};

// ─── Hook: Single Anime Details ───────────────────────────
export const useAnimeById = (id) => {
    return useQuery({
        queryKey: ["anime", id],
        queryFn: () => getAnimeById(id),
        enabled: !!id,                // don't run if id is undefined
    });
};

// ─── Hook: Search ─────────────────────────────────────────
export const useSearchAnime = (query) => {
    return useQuery({
        queryKey: ["search-anime", query],
        queryFn: () => searchAnime(query),
        enabled: query.length > 2,   // only search after 3 chars typed
        staleTime: 1000 * 60 * 2,
    });
};

// ─── Hook: Top Manga ──────────────────────────────────────
export const useTopManga = () => {
    return useQuery({
        queryKey: ["top-manga"],
        queryFn: getTopManga,
        staleTime: 1000 * 60 * 10,
    });
};

// ─── Hook: Single Manga Details ───────────────────────────
export const useMangaById = (id) => {
    return useQuery({
        queryKey: ["manga", id],
        queryFn: () => getMangaById(id),
        enabled: !!id,
    });
};

// ─── Hook: Manga Characters ───────────────────────────────
export const useMangaCharacters = (id) => {
    return useQuery({
        queryKey: ["manga-characters", id],
        queryFn: () => getMangaCharacters(id),
        enabled: !!id,
    });
};