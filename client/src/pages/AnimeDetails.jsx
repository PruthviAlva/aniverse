// AnimeDetails.jsx — Full detail page for a single anime
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Tv,
  Calendar,
  Clock,
  ArrowLeft,
  Users,
  Award,
  Plus,
  Play,
} from "lucide-react";
import { useAnimeById } from "../hooks/useAnime";
import Badge from "../components/common/Badge";

// ─── Small stat card used in the info grid ─────────────────
const StatCard = ({ icon: Icon, label, value }) => (
  <div
    className="flex flex-col items-center justify-center gap-1
                  bg-anime-card border border-anime-border rounded-xl p-4 text-center"
  >
    <Icon size={20} className="text-anime-primary" />
    <span className="text-anime-muted text-xs">{label}</span>
    <span className="text-anime-text font-semibold text-sm">
      {value || "N/A"}
    </span>
  </div>
);

const AnimeDetails = () => {
  // Get the anime ID from the URL (/anime/:id)
  const { id } = useParams();
  const { data, isLoading, isError } = useAnimeById(id);

  const anime = data?.data;

  // ── Loading State ────────────────────────────────────────
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

  // ── Error State ──────────────────────────────────────────
  if (isError || !anime) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20
                      flex flex-col items-center gap-4"
      >
        <p className="text-anime-muted text-lg">Anime not found.</p>
        <Link to="/" className="text-anime-primary hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    );
  }

  // ── Destructure anime data ───────────────────────────────
  const {
    title,
    title_english,
    synopsis,
    score,
    scored_by,
    rank,
    popularity,
    episodes,
    status,
    aired,
    duration,
    genres,
    studios,
    images,
    trailer,
    rating,
    type,
    source,
  } = anime;

  const displayTitle = title_english || title;
  const coverImage = images?.jpg?.large_image_url;
  const youtubeEmbed = trailer?.embed_url;

  return (
    <div className="min-h-screen bg-anime-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Back Button ─────────────────────────────────── */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-anime-muted
                     hover:text-anime-primary transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* ── Top Section: Cover + Info ────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Cover Image */}
          <div className="shrink-0 mx-auto md:mx-0">
            <img
              src={coverImage}
              alt={displayTitle}
              className="w-56 sm:w-64 rounded-xl border border-anime-border
                         shadow-2xl shadow-black/50 object-cover"
            />
          </div>

          {/* Info Panel */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Title */}
            <div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold
                             text-anime-text leading-tight"
              >
                {displayTitle}
              </h1>
              {/* Japanese title if different */}
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

            {/* Genre Badges */}
            {genres && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <Badge key={g.mal_id} label={g.name} color="primary" />
                ))}
              </div>
            )}

            {/* Studios */}
            {studios?.length > 0 && (
              <p className="text-anime-muted text-sm">
                <span className="text-anime-text font-medium">Studio: </span>
                {studios.map((s) => s.name).join(", ")}
              </p>
            )}

            {/* Age Rating */}
            {rating && (
              <p className="text-anime-muted text-sm">
                <span className="text-anime-text font-medium">Rating: </span>
                {rating}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                className="flex items-center gap-2 bg-anime-primary
                                 hover:bg-orange-600 text-white font-semibold
                                 px-6 py-3 rounded-lg transition-colors"
              >
                <Plus size={18} />
                Add to Watchlist
              </button>

              {trailer?.url && (
                <a
                  href={trailer?.embed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-anime-card
                             hover:bg-anime-border text-anime-text font-semibold
                             px-6 py-3 rounded-lg border border-anime-border
                             transition-colors"
                >
                  <Play size={18} />
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <StatCard icon={Tv} label="Episodes" value={episodes} />
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
          <StatCard icon={Clock} label="Duration" value={duration} />
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

        {/* ── Trailer Embed ───────────────────────────────── */}
        {youtubeEmbed && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-anime-text mb-4">Trailer</h2>
            <div
              className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden
                            border border-anime-border"
            >
              <iframe
                src={youtubeEmbed}
                title={`${displayTitle} trailer`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write;
                       encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </section>
        )}

        {/* ── Airing Info ─────────────────────────────────── */}
        {aired?.string && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-anime-text mb-3">Aired</h2>
            <p className="text-anime-muted text-sm">{aired.string}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default AnimeDetails;
