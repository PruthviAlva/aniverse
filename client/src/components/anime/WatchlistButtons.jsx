// ─── Watchlist Action Buttons ──────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Play, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  useAddToWatchlist,
  useToggleFavorite,
  useFavorites,
  useWatchlist,
  useRemoveFromWatchlist,
} from "../../hooks/useWatchlist";

const WatchlistButtons = ({ anime }) => {
  const { trailer } = anime;
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Fetch user's existing watchlist + favorites ──────────
  const { data: watchlistData } = useWatchlist();
  const { data: favData } = useFavorites();

  // Check if this anime is already saved
  const existingItem = watchlistData?.watchlist?.find(
    (w) => w.animeId === anime.mal_id,
  );
  const isInWatchlist = !!existingItem;
  const isFavorited = favData?.favorites?.some(
    (f) => f.animeId === anime.mal_id,
  );

  // Default status to existing one if already added
  const [status, setStatus] = useState(existingItem?.status || "PLANNING");

  const { mutate: addToWatchlist, isPending: addingToWatchlist } =
    useAddToWatchlist();
  const { mutate: removeFromList, isPending: removingFromList } =
    useRemoveFromWatchlist();
  const { mutate: toggleFav, isPending: togglingFav } = useToggleFavorite();

  const handleWatchlistClick = () => {
    if (!user) return navigate("/login");

    if (isInWatchlist) {
      // Already added — remove it
      removeFromList(anime.mal_id);
    } else {
      // Not added — add it
      addToWatchlist({
        animeId: anime.mal_id,
        animeTitle: anime.title_english || anime.title,
        animeCover: anime.images?.jpg?.large_image_url,
        status,
      });
    }
  };

  const handleToggleFavorite = () => {
    if (!user) return navigate("/login");
    toggleFav({
      animeId: anime.mal_id,
      animeTitle: anime.title_english || anime.title,
      animeCover: anime.images?.jpg?.large_image_url,
      type: "ANIME",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-2">
      {/* Status selector — only show if NOT already in watchlist */}
      {!isInWatchlist && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-anime-card border border-anime-border text-anime-text
                     text-sm rounded-lg px-3 py-3 focus:outline-none
                     focus:border-anime-primary transition-colors"
        >
          <option value="PLANNING">Plan to Watch</option>
          <option value="WATCHING">Watching</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="DROPPED">Dropped</option>
        </select>
      )}

      {/* Watchlist button — changes based on state */}
      <button
        onClick={handleWatchlistClick}
        disabled={addingToWatchlist || removingFromList}
        className={`flex items-center gap-2 font-semibold px-6 py-3
                    rounded-lg transition-colors disabled:opacity-50
                    ${
                      isInWatchlist
                        ? "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-400"
                        : "bg-anime-primary hover:bg-orange-600 text-white"
                    }`}
      >
        <Plus size={18} />
        {addingToWatchlist
          ? "Adding..."
          : removingFromList
            ? "Removing..."
            : isInWatchlist
              ? "In Watchlist (click to remove)"
              : "Add to Watchlist"}
      </button>

      {/* Favorite button */}
      <button
        onClick={handleToggleFavorite}
        disabled={togglingFav}
        className={`flex items-center gap-2 font-semibold px-6 py-3
                    rounded-lg border transition-colors
                    ${
                      isFavorited
                        ? "bg-pink-500/20 border-pink-500/40 text-pink-400"
                        : "bg-anime-card border-anime-border text-anime-muted hover:border-pink-400 hover:text-pink-400"
                    }`}
      >
        <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
        {isFavorited ? "Favorited" : "Favorite"}
      </button>

      {/* Trailer button */}
      {trailer?.url && (
        <a
          href={trailer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-anime-card hover:bg-anime-border
                     text-anime-text font-semibold px-6 py-3 rounded-lg
                     border border-anime-border transition-colors"
        >
          <Play size={18} />
          Watch Trailer
        </a>
      )}
    </div>
  );
};

export default WatchlistButtons;
