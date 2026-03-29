// Watchlist.jsx — Shows user's saved anime list
import { Link } from "react-router-dom";
import { Trash2, Loader2, BookOpen } from "lucide-react";
import {
  useWatchlist,
  useRemoveFromWatchlist,
  useUpdateWatchlistStatus,
} from "../hooks/useWatchlist";

// Status badge colors
const STATUS_COLORS = {
  WATCHING: "bg-green-500/20 text-green-400 border-green-400/30",
  COMPLETED: "bg-blue-500/20 text-blue-400 border-blue-400/30",
  PLANNING: "bg-purple-500/20 text-purple-400 border-purple-400/30",
  ON_HOLD: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
  DROPPED: "bg-red-500/20 text-red-400 border-red-400/30",
};

const Watchlist = () => {
  const { data, isLoading } = useWatchlist();
  const { mutate: removeItem, isPending: removing } = useRemoveFromWatchlist();
  const { mutate: updateStatus } = useUpdateWatchlistStatus();

  const watchlist = data?.watchlist || [];

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-anime-bg flex items-center justify-center">
        <Loader2 size={32} className="text-anime-primary animate-spin" />
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────
  if (watchlist.length === 0) {
    return (
      <div
        className="min-h-screen bg-anime-bg flex flex-col items-center
                      justify-center gap-4 px-4"
      >
        <BookOpen size={48} className="text-anime-border" />
        <h2 className="text-xl font-bold text-anime-text">
          Your watchlist is empty
        </h2>
        <p className="text-anime-muted text-sm text-center">
          Browse anime and add them to your watchlist
        </p>
        <Link
          to="/"
          className="bg-anime-primary hover:bg-orange-600 text-white
                     font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Browse Anime
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-anime-text">My Watchlist</h1>
        <p className="text-anime-muted text-sm mt-1">
          {watchlist.length} anime tracked
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 bg-anime-card border border-anime-border
                       rounded-xl p-4 hover:border-anime-primary transition-colors"
          >
            {/* Cover */}
            <Link to={`/anime/${item.animeId}`} className="shrink-0">
              <img
                src={item.animeCover}
                alt={item.animeTitle}
                className="w-16 h-24 object-cover rounded-lg"
              />
            </Link>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <Link
                to={`/anime/${item.animeId}`}
                className="text-anime-text font-semibold text-sm
                           hover:text-anime-primary transition-colors
                           line-clamp-2 leading-tight"
              >
                {item.animeTitle}
              </Link>

              {/* Status badge */}
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full
                                border w-fit ${STATUS_COLORS[item.status]}`}
              >
                {item.status.replace("_", " ")}
              </span>

              {/* Status selector */}
              <select
                value={item.status}
                onChange={(e) =>
                  updateStatus({
                    animeId: item.animeId,
                    status: e.target.value,
                  })
                }
                className="bg-anime-bg border border-anime-border text-anime-text
                           text-xs rounded-lg px-2 py-1.5 focus:outline-none
                           focus:border-anime-primary transition-colors"
              >
                <option value="PLANNING">Plan to Watch</option>
                <option value="WATCHING">Watching</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="DROPPED">Dropped</option>
              </select>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeItem(item.animeId)}
              disabled={removing}
              className="text-anime-muted hover:text-red-400 transition-colors
                         self-start shrink-0 p-1"
              title="Remove from watchlist"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
