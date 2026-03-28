// AnimeRow.jsx — Horizontal scrolling row of anime cards
import AnimeCard from "./AnimeCard";
import SkeletonCard from "../common/SkeletonCard";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const AnimeRow = ({ title, animeList, isLoading, viewAllPath }) => {
  // Show 12 skeleton cards while loading
  const skeletons = Array.from({ length: 12 });

  return (
    <section className="py-6">
      {/* ── Row Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-anime-text">{title}</h2>

        {/* "View All" link — only shown if path provided */}
        {viewAllPath && (
          <Link
            to={viewAllPath}
            className="flex items-center gap-1 text-sm text-anime-primary
                       hover:text-orange-400 transition-colors font-medium"
          >
            View All
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {/* ── Scrollable Grid ──────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                        lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {isLoading
            ? // Show skeletons while loading
              skeletons.map((_, i) => <SkeletonCard key={i} />)
            : // Show real anime cards
              animeList?.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default AnimeRow;
