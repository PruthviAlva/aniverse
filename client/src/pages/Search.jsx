// Search.jsx — Search page with debounced Jikan API calls
import { useState } from "react";
import { Search as SearchIcon, Loader2, AlertCircle } from "lucide-react";
import { useSearchAnime } from "../hooks/useAnime";
import useDebounce from "../hooks/useDebounce";
import AnimeCard from "../components/anime/AnimeCard";
import SkeletonCard from "../components/common/SkeletonCard";

const Search = () => {
  // Raw input value — updates on every keystroke
  const [query, setQuery] = useState("");

  // Debounced value — only updates 500ms after user stops typing
  const debouncedQuery = useDebounce(query, 500);

  // Only fires when debouncedQuery changes (and length > 2)
  const { data, isLoading, isError } = useSearchAnime(debouncedQuery);

  const results   = data?.data || [];
  const hasQuery  = debouncedQuery.length > 2;
  const noResults = hasQuery && !isLoading && results.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page Header ───────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-anime-text mb-2">
          Search Anime
        </h1>
        <p className="text-anime-muted text-sm">
          Search from thousands of anime titles via MyAnimeList
        </p>
      </div>

      {/* ── Search Input ──────────────────────────────────── */}
      <div className="relative max-w-2xl mb-10">
        {/* Search icon inside input */}
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-anime-muted"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for anime... (e.g. Naruto, Attack on Titan)"
          className="w-full bg-anime-card border border-anime-border text-anime-text
                     placeholder-anime-muted rounded-xl px-4 py-4 pl-12
                     focus:outline-none focus:border-anime-primary
                     transition-colors duration-200 text-sm sm:text-base"
        />

        {/* Loading spinner inside input — shown while fetching */}
        {isLoading && (
          <Loader2
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       text-anime-primary animate-spin"
          />
        )}
      </div>

      {/* ── States ────────────────────────────────────────── */}

      {/* Initial state — user hasn't typed enough yet */}
      {!hasQuery && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <SearchIcon size={48} className="text-anime-border" />
          <p className="text-anime-muted text-center">
            Type at least 3 characters to search
          </p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex items-center gap-3 text-red-400 bg-red-400/10
                        border border-red-400/20 rounded-xl p-4 max-w-lg">
          <AlertCircle size={20} />
          <p className="text-sm">
            Something went wrong. Jikan API may be rate-limited — wait a moment and try again.
          </p>
        </div>
      )}

      {/* No results state */}
      {noResults && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-anime-muted text-center text-lg">
            No results found for{" "}
            <span className="text-anime-primary font-semibold">
              "{debouncedQuery}"
            </span>
          </p>
          <p className="text-anime-muted text-sm">
            Try a different spelling or keyword
          </p>
        </div>
      )}

      {/* ── Results Grid ──────────────────────────────────── */}
      {hasQuery && (
        <>
          {/* Results count — shown after data loads */}
          {!isLoading && results.length > 0 && (
            <p className="text-anime-muted text-sm mb-4">
              Found{" "}
              <span className="text-anime-primary font-semibold">
                {results.length}
              </span>{" "}
              results for "{debouncedQuery}"
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                          lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : results.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))
            }
          </div>
        </>
      )}

    </div>
  );
};

export default Search;