// Manga.jsx — Browse manga with filtering + pagination
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../services/animeService";
import MangaCard from "../components/manga/MangaCard";
import SkeletonCard from "../components/common/SkeletonCard";
import Pagination from "../components/common/Pagination";

const FILTERS = [
  { label: "⭐ Top Manga", endpoint: "/top/manga" },
  { label: "📖 Manhwa", endpoint: "/top/manga?type=manhwa" },
  { label: "📚 Novels", endpoint: "/top/manga?type=novel" },
  { label: "🔥 Publishing", endpoint: "/top/manga?filter=publishing" },
];

const buildUrl = (endpoint, page, limit = 24) => {
  const separator = endpoint.includes("?") ? "&" : "?";
  return `${endpoint}${separator}limit=${limit}&page=${page}`;
};

const Manga = () => {
  const [activeFilter, setActiveFilter] = useState(0);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga-browse", activeFilter, page],
    queryFn: () => fetcher(buildUrl(FILTERS[activeFilter].endpoint, page)),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const mangaList = data?.data || [];
  const pagination = data?.pagination || {};

  const handleFilterChange = (index) => {
    setActiveFilter(index);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-anime-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-anime-text mb-2">Manga</h1>
          <p className="text-anime-muted text-sm">
            Explore top manga, manhwa and novels
          </p>
        </div>

        {/* ── Filter Tabs ─────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FILTERS.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleFilterChange(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium
                          transition-colors border
                          ${
                            activeFilter === index
                              ? "bg-anime-primary border-anime-primary text-white"
                              : "bg-anime-card border-anime-border text-anime-muted hover:border-anime-primary hover:text-anime-primary"
                          }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* ── Results count ───────────────────────────────── */}
        {!isLoading && pagination?.items && (
          <p className="text-anime-muted text-sm mb-4">
            Showing{" "}
            <span className="text-anime-text font-medium">
              {(page - 1) * 24 + 1}–
              {Math.min(page * 24, pagination.items.total)}
            </span>{" "}
            of{" "}
            <span className="text-anime-text font-medium">
              {pagination.items.total?.toLocaleString()}
            </span>{" "}
            results
          </p>
        )}

        {/* ── Error ───────────────────────────────────────── */}
        {isError && (
          <p className="text-red-400 text-sm mb-4">
            Failed to load — Jikan may be rate limited. Wait a moment and try
            again.
          </p>
        )}

        {/* ── Grid ────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                        lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {isLoading
            ? Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)
            : mangaList.map((manga) => (
                <MangaCard key={manga.mal_id} manga={manga} />
              ))}
        </div>

        {/* ── Pagination ──────────────────────────────────── */}
        {!isLoading && pagination?.last_visible_page > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.last_visible_page}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Manga;
