// useYoutube.js — TanStack Query hooks for YouTube data
import { useQuery } from "@tanstack/react-query";
import {
    searchMuseAsiaEpisodes,
    searchEpisode,
} from "../services/youtubeService";

// ─── Hook: Fetch episode list for an anime ─────────────────
export const useMuseAsiaEpisodes = (animeTitle) => {
    return useQuery({
        queryKey: ["muse-asia", animeTitle],
        queryFn: () => searchMuseAsiaEpisodes(animeTitle),
        enabled: !!animeTitle,
        staleTime: 1000 * 60 * 30, // cache 30 min — YouTube data doesn't change often
    });
};

// ─── Hook: Fetch a specific episode ───────────────────────
export const useEpisodeSearch = (animeTitle, episodeNumber) => {
    return useQuery({
        queryKey: ["episode", animeTitle, episodeNumber],
        queryFn: () => searchEpisode(animeTitle, episodeNumber),
        enabled: !!animeTitle && !!episodeNumber,
        staleTime: 1000 * 60 * 30,
    });
};