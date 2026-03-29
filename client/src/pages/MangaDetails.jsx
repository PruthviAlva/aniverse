// MangaDetails.jsx — Full detail page for a single manga
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  Star,
  BookOpen,
  Calendar,
  ArrowLeft,
  Users,
  Award,
  Plus,
  Heart,
  Layers,
} from "lucide-react";
import { useMangaById, useMangaCharacters } from "../hooks/useAnime";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  useToggleFavorite,
  useFavorites,
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from "../hooks/useWatchlist";
import Badge from "../components/common/Badge";

// ─── Stat Card ─────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value }) => (
  <div
    className="flex flex-col items-center justify-center gap-1
                  bg-anime-card border border-anime-border
                  rounded-xl p-4 text-center"
  >
    <Icon size={20} className="text-anime-primary" />
    <span className="text-anime-muted text-xs">{label}</span>
    <span className="text-anime-text font-semibold text-sm">
      {value || "N/A"}
    </span>
  </div>
);

// ─── Manga Watchlist Buttons ───────────────────────────────
const MangaWatchlistButtons = ({ manga }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("PLANNING");

  const { data: watchlistData } = useWatchlist();
  const { data: favData } = useFavorites();

  const existingItem = watchlistData?.watchlist?.find(
    (w) => w.animeId === manga.mal_id,
  );
  const isInWatchlist = !!existingItem;
  const isFavorited = favData?.favorites?.some(
    (f) => f.animeId === manga.mal_id && f.type === "MANGA",
  );

  const { mutate: addToWatchlist, isPending: adding } = useAddToWatchlist();
  const { mutate: removeFromList, isPending: removing } =
    useRemoveFromWatchlist();
  const { mutate: toggleFav, isPending: toggling } = useToggleFavorite();

  const handleWatchlistClick = () => {
    if (!user) return navigate("/login");
    if (isInWatchlist) {
      removeFromList(manga.mal_id);
    } else {
      addToWatchlist({
        animeId: manga.mal_id,
        animeTitle: manga.title_english || manga.title,
        animeCover: manga.images?.jpg?.large_image_url,
        status,
      });
    }
  };

  const handleToggleFavorite = () => {
    if (!user) return navigate("/login");
    toggleFav({
      animeId: manga.mal_id,
      animeTitle: manga.title_english || manga.title,
      animeCover: manga.images?.jpg?.large_image_url,
      type: "MANGA",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-2">
      {/* Status selector */}
      {!isInWatchlist && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-anime-card border border-anime-border text-anime-text
                     text-sm rounded-lg px-3 py-3 focus:outline-none
                     focus:border-anime-primary transition-colors"
        >
          <option value="PLANNING">Plan to Read</option>
          <option value="WATCHING">Reading</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="DROPPED">Dropped</option>
        </select>
      )}

      {/* Watchlist button */}
      <button
        onClick={handleWatchlistClick}
        disabled={adding || removing}
        className={`flex items-center gap-2 font-semibold px-6 py-3
                    rounded-lg transition-colors disabled:opacity-50
                    ${
                      isInWatchlist
                        ? "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-400"
                        : "bg-anime-primary hover:bg-orange-600 text-white"
                    }`}
      >
        <Plus size={18} />
        {adding
          ? "Adding..."
          : removing
            ? "Removing..."
            : isInWatchlist
              ? "In Reading List (click to remove)"
              : "Add to Reading List"}
      </button>

      {/* Favorite button */}
      <button
        onClick={handleToggleFavorite}
        disabled={toggling}
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
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────
const MangaDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useMangaById(id);
  const { data: charactersData } = useMangaCharacters(id);

  const manga = data?.data;
  const characters = charactersData?.data?.slice(0, 12) || [];

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10
                      animate-pulse space-y-6"
      >
        <div className="h-6 w-32 bg-anime-border rounded" />
        <div className="flex gap-8">
          <div className="w-64 h-96 bg-anime-border rounded-xl shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-96 bg-anime-border rounded" />
            <div className="h-4 w-full bg-anime-border rounded" />
            <div className="h-4 w-full bg-anime-border rounded" />
            <div className="h-4 w-2/3 bg-anime-border rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (isError || !manga) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20
                      flex flex-col items-center gap-4"
      >
        <p className="text-anime-muted text-lg">Manga not found.</p>
        <Link
          to="/manga"
          className="text-anime-primary hover:underline text-sm"
        >
          ← Back to Manga
        </Link>
      </div>
    );
  }

  const {
    title,
    title_english,
    synopsis,
    score,
    scored_by,
    rank,
    popularity,
    chapters,
    volumes,
    status,
    genres,
    authors,
    images,
    type,
    published,
    rating,
    themes,
    demographics,
  } = manga;

  const displayTitle = title_english || title;
  const coverImage = images?.jpg?.large_image_url;

  return (
    <div className="min-h-screen bg-anime-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Back Button ─────────────────────────────────── */}
        <Link
          to="/manga"
          className="inline-flex items-center gap-2 text-anime-muted
                     hover:text-anime-primary transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Manga
        </Link>

        {/* ── Top Section ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Cover */}
          <div className="shrink-0 mx-auto md:mx-0">
            <img
              src={coverImage}
              alt={displayTitle}
              className="w-56 sm:w-64 rounded-xl border border-anime-border
                         shadow-2xl shadow-black/50 object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Title */}
            <div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold
                             text-anime-text leading-tight"
              >
                {displayTitle}
              </h1>
              {title_english && title !== title_english && (
                <p className="text-anime-muted text-sm mt-1">{title}</p>
              )}
            </div>

            {/* Score */}
            {score && (
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 bg-yellow-400/10
                                border border-yellow-400/20 rounded-lg px-3 py-1.5"
                >
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">
                    {score}
                  </span>
                </div>
                {scored_by && (
                  <span className="text-anime-muted text-sm">
                    {scored_by.toLocaleString()} ratings
                  </span>
                )}
              </div>
            )}

            {/* Genres */}
            {genres && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <Badge key={g.mal_id} label={g.name} color="primary" />
                ))}
              </div>
            )}

            {/* Themes */}
            {themes?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {themes.map((t) => (
                  <Badge key={t.mal_id} label={t.name} color="purple" />
                ))}
              </div>
            )}

            {/* Demographics */}
            {demographics?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {demographics.map((d) => (
                  <Badge key={d.mal_id} label={d.name} color="gray" />
                ))}
              </div>
            )}

            {/* Authors */}
            {authors?.length > 0 && (
              <p className="text-anime-muted text-sm">
                <span className="text-anime-text font-medium">Author: </span>
                {authors.map((a) => a.name).join(", ")}
              </p>
            )}

            {/* Watchlist + Favorite buttons */}
            <MangaWatchlistButtons manga={manga} />
          </div>
        </div>

        {/* ── Stats Grid ──────────────────────────────────── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6
                        gap-3 mb-10"
        >
          <StatCard icon={BookOpen} label="Chapters" value={chapters} />
          <StatCard icon={Layers} label="Volumes" value={volumes} />
          <StatCard
            icon={Award}
            label="Rank"
            value={rank ? `#${rank}` : null}
          />
          <StatCard
            icon={Users}
            label="Popularity"
            value={popularity ? `#${popularity}` : null}
          />
          <StatCard icon={Calendar} label="Status" value={status} />
          <StatCard icon={Star} label="Type" value={type} />
        </div>

        {/* ── Synopsis ────────────────────────────────────── */}
        {synopsis && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-anime-text mb-3">Synopsis</h2>
            <p className="text-anime-muted leading-relaxed text-sm sm:text-base">
              {synopsis}
            </p>
          </section>
        )}

        {/* ── Characters ──────────────────────────────────── */}
        {characters.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-anime-text mb-4">
              Characters
            </h2>
            <div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6
                            lg:grid-cols-8 gap-3"
            >
              {characters.map(({ character, role }) => (
                <div
                  key={character.mal_id}
                  className="flex flex-col items-center gap-2 text-center group"
                >
                  <div
                    className="w-full aspect-square rounded-xl overflow-hidden
                                  border border-anime-border group-hover:border-anime-primary
                                  transition-colors"
                  >
                    <img
                      src={character.images?.jpg?.image_url}
                      alt={character.name}
                      className="w-full h-full object-cover object-top
                                 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p
                    className="text-anime-text text-xs font-medium
                                line-clamp-2 leading-tight"
                  >
                    {character.name}
                  </p>
                  <p className="text-anime-muted text-xs">{role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Published Info ──────────────────────────────── */}
        {published?.string && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-anime-text mb-3">
              Published
            </h2>
            <p className="text-anime-muted text-sm">{published.string}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default MangaDetails;
