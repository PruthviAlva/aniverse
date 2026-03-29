// useWatchlist.js — TanStack Query hooks for watchlist + favorites
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
    getFavorites,
    toggleFavorite,
} from "../services/userService";
import { useAuth } from "../context/AuthContext";

// ─── Watchlist Hooks ──────────────────────────────────────
export const useWatchlist = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["watchlist"],
        queryFn: getWatchlist,
        enabled: !!user, // only fetch if logged in
    });
};

export const useAddToWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ animeId, animeTitle, animeCover, status }) =>
            addToWatchlist(animeId, animeTitle, animeCover, status),

        // Refresh the watchlist after adding
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
    });
};

export const useRemoveFromWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (animeId) => removeFromWatchlist(animeId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
    });
};

export const useUpdateWatchlistStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ animeId, status, progress }) =>
            updateWatchlistStatus(animeId, status, progress),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
    });
};

// ─── Favorites Hooks ──────────────────────────────────────
export const useFavorites = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["favorites"],
        queryFn: getFavorites,
        enabled: !!user,
    });
};

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ animeId, animeTitle, animeCover, type }) =>
            toggleFavorite(animeId, animeTitle, animeCover, type),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
    });
};