// HeroBanner.jsx — Featured anime banner at the top of the homepage
import { Link } from "react-router-dom";
import { Play, Plus, Star } from "lucide-react";

const HeroBanner = ({ anime, isLoading }) => {

  // ── Loading State ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full h-[70vh] bg-anime-card animate-pulse flex
                      items-end p-8 sm:p-12">
        <div className="flex flex-col gap-3 max-w-lg">
          <div className="h-8 w-64 bg-anime-border rounded" />
          <div className="h-4 w-96 bg-anime-border rounded" />
          <div className="h-4 w-80 bg-anime-border rounded" />
          <div className="flex gap-3 mt-2">
            <div className="h-10 w-28 bg-anime-border rounded-lg" />
            <div className="h-10 w-28 bg-anime-border rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime) return null;

  const {
    mal_id,
    title,
    title_english,
    synopsis,
    score,
    images,
    genres,
  } = anime;

  const displayTitle   = title_english || title;
  const backdropImage  = images?.jpg?.large_image_url;

  // Trim synopsis to avoid huge walls of text
  const shortSynopsis = synopsis
    ? synopsis.slice(0, 200) + (synopsis.length > 200 ? "..." : "")
    : "No description available.";

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">

      {/* ── Background Image ──────────────────────────────── */}
      <img
        src={backdropImage}
        alt={displayTitle}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Gradient overlay — fades image into dark bg */}
      <div className="absolute inset-0 bg-gradient-to-r
                      from-anime-bg via-anime-bg/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t
                      from-anime-bg via-transparent to-transparent" />

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10 h-full flex items-end pb-12 sm:pb-16
                      px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-xl">

          {/* Genre tags */}
          {genres && (
            <div className="flex flex-wrap gap-2 mb-3">
              {genres.slice(0, 3).map((g) => (
                <span
                  key={g.mal_id}
                  className="text-xs font-medium bg-anime-primary/20
                             text-anime-primary border border-anime-primary/30
                             px-2 py-1 rounded-full"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold
                         text-white leading-tight mb-3">
            {displayTitle}
          </h1>

          {/* Score */}
          {score && (
            <div className="flex items-center gap-1 mb-3">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{score}</span>
              <span className="text-anime-muted text-sm">/ 10</span>
            </div>
          )}

          {/* Synopsis */}
          <p className="text-anime-muted text-sm sm:text-base
                        leading-relaxed mb-6 line-clamp-3">
            {shortSynopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/anime/${mal_id}`}
              className="flex items-center gap-2 bg-anime-primary hover:bg-orange-600
                         text-white font-semibold px-6 py-3 rounded-lg
                         transition-colors duration-200"
            >
              <Play size={18} fill="currentColor" />
              View Details
            </Link>

            <button
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20
                         backdrop-blur-sm text-white font-semibold px-6 py-3
                         rounded-lg border border-white/20 transition-colors duration-200"
            >
              <Plus size={18} />
              Add to List
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
