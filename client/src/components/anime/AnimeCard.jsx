// AnimeCard.jsx — Reusable card for displaying an anime
import { Link } from "react-router-dom";
import { Star, Tv, BookOpen } from "lucide-react";

const AnimeCard = ({ anime }) => {
  // Jikan API nests data — extract what we need safely
  const {
    mal_id,
    title,
    title_english,
    images,
    score,
    episodes,
    status,
    type,
  } = anime;

  // Use English title if available, fallback to Japanese
  const displayTitle = title_english || title;

  // Cover image from Jikan
  const coverImage = images?.jpg?.large_image_url || images?.jpg?.image_url;

  // Color badge based on airing status // like switch case
  const statusColor =
    {
      "Currently Airing": "bg-green-500",
      "Finished Airing": "bg-anime-muted",
      "Not yet aired": "bg-anime-purple",
    }[status] || "bg-anime-muted";

  return (
    <Link
      to={`/anime/${mal_id}`}
      className="group relative flex flex-col bg-anime-card border border-anime-border
                 rounded-xl overflow-hidden hover:border-anime-primary
                 hover:shadow-lg hover:shadow-anime-primary/10
                 transition-all duration-300 cursor-pointer"
    >
      {/* ── Cover Image ─────────────────────────────────── */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={coverImage}
          alt={displayTitle}
          className="w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-500"
          loading="lazy" // don't load until visible
        />

        {/* Score badge — top right corner */}
        {score && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1
                          bg-black/70 backdrop-blur-sm text-yellow-400
                          text-xs font-bold px-2 py-1 rounded-lg"
          >
            <Star size={12} fill="currentColor" />
            {score.toFixed(1)}
          </div>
        )}

        {/* Status badge — top left corner */}
        <div
          className={`absolute top-2 left-2 text-white text-xs
                         font-medium px-2 py-1 rounded-lg ${statusColor}`}
        >
          {status === "Currently Airing" ? "Airing" : status}
        </div>

        {/* Hover overlay with more info */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent
                        to-transparent opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 flex items-end p-3"
        >
          <div className="flex items-center gap-3 text-white text-xs">
            {/* Episode count */}
            {episodes && (
              <span className="flex items-center gap-1">
                <Tv size={12} />
                {episodes} eps
              </span>
            )}
            {/* Type (TV, Movie, OVA) */}
            {type && (
              <span className="flex items-center gap-1">
                <BookOpen size={12} />
                {type}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Card Info ───────────────────────────────────── */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3
          className="text-anime-text text-sm font-semibold
                       line-clamp-2 group-hover:text-anime-primary
                       transition-colors leading-tight"
        >
          {displayTitle}
        </h3>
      </div>
    </Link>
  );
};

export default AnimeCard;
