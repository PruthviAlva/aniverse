// useMangaDex.js — TanStack Query hooks for MangaDex
import { useQuery } from "@tanstack/react-query";
import {
    searchMangaDex,
    getMangaChapters,
    getChapterPages,
} from "../services/mangaDexService";

// ─── Search MangaDex by title ─────────────────────────────
export const useMangaDexSearch = (title) => {
    return useQuery({
        queryKey: ["mangadex-search", title],
        queryFn: () => searchMangaDex(title),
        enabled: !!title,
        staleTime: 1000 * 60 * 60, // cache 1 hour
    });
};

// ─── Get chapters list ────────────────────────────────────
export const useMangaChapters = (mangaDexId, page = 1) => {
    return useQuery({
        queryKey: ["manga-chapters", mangaDexId, page],
        queryFn: () => getMangaChapters(mangaDexId, page),
        enabled: !!mangaDexId,
        staleTime: 1000 * 60 * 30,
        keepPreviousData: true,
    });
};

// ─── Get pages for a chapter ─────────────────────────────
export const useChapterPages = (chapterId) => {
    return useQuery({
        queryKey: ["chapter-pages", chapterId],
        queryFn: () => getChapterPages(chapterId),
        enabled: !!chapterId,
        staleTime: 1000 * 60 * 60,
    });
};