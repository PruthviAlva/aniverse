// MangaCard.jsx — Card component for manga entries
import { Link } from "react-router-dom";
import { Star, BookOpen } from "lucide-react";

const MangaCard = ({ manga }) => {
  const {
    mal_id,
    title,
    title_english,
    images,
    score,
    chapters,
    status,
    type,
  } = manga;

  const displayTitle = title_english || title;
  const coverImage = images?.jpg?.large_image_url || images?.jpg?.image_url;

  const statusColor =
    {
      Publishing: "bg-green-500",
      Finished: "bg-anime-muted",
      "On Hiatus": "bg-yellow-500",
      Discontinued: "bg-red-500",
      "Not yet published": "bg-anime-purple",
    }[status] || "bg-anime-muted";

  return (
    <Link
      to={`/manga/${mal_id}`}
      className="group relative flex flex-col bg-anime-card border border-anime-border
                 rounded-xl overflow-hidden hover:border-anime-primary
                 hover:shadow-lg hover:shadow-anime-primary/10
                 transition-all duration-300 cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={coverImage}
          alt={displayTitle}
          className="w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Score badge */}
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

        {/* Status badge */}
        <div
          className={`absolute top-2 left-2 text-white text-xs
                         font-medium px-2 py-1 rounded-lg ${statusColor}`}
        >
          {status === "Publishing" ? "Publishing" : status}
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80
                        via-transparent to-transparent opacity-0
                        group-hover:opacity-100 transition-opacity duration-300
                        flex items-end p-3"
        >
          <div className="flex items-center gap-3 text-white text-xs">
            {chapters && (
              <span className="flex items-center gap-1">
                <BookOpen size={12} />
                {chapters} ch
              </span>
            )}
            {type && <span>{type}</span>}
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3">
        <h3
          className="text-anime-text text-sm font-semibold line-clamp-2
                       group-hover:text-anime-primary transition-colors
                       leading-tight"
        >
          {displayTitle}
        </h3>
      </div>
    </Link>
  );
};

export default MangaCard;
