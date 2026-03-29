// YoutubePlayer.jsx — Episode sidebar + main player layout
import { useState } from "react";
import {
  Play,
  ExternalLink,
  Loader2,
  Youtube,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMuseAsiaEpisodes } from "../../hooks/useYoutube";

// ─── Episode List Item ─────────────────────────────────────
const EpisodeItem = ({ video, index, isActive, onClick }) => {
  const title = video.snippet?.title;
  const thumbnail = video.snippet?.thumbnails?.default?.url;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full text-left px-3 py-2.5
                  rounded-lg transition-colors border-l-2
                  ${
                    isActive
                      ? "bg-anime-primary/10 border-l-anime-primary text-anime-primary"
                      : "border-l-transparent hover:bg-anime-border/30 text-anime-muted hover:text-anime-text"
                  }`}
    >
      {/* Episode number */}
      <span
        className={`shrink-0 w-8 h-8 rounded-lg flex items-center
                        justify-center text-xs font-bold
                        ${
                          isActive
                            ? "bg-anime-primary text-white"
                            : "bg-anime-border text-anime-muted"
                        }`}
      >
        {index + 1}
      </span>

      {/* Thumbnail */}
      <div className="relative shrink-0 w-16 h-10 rounded overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        {isActive && (
          <div
            className="absolute inset-0 bg-anime-primary/30
                          flex items-center justify-center"
          >
            <Play size={12} className="text-white fill-white" />
          </div>
        )}
      </div>

      {/* Title */}
      <span className="text-xs line-clamp-2 leading-tight flex-1">{title}</span>
    </button>
  );
};

// ─── Main Player ───────────────────────────────────────────
const YoutubePlayer = ({ animeTitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchEpisode, setSearchEpisode] = useState("");

  const { data: videos, isLoading, isError } = useMuseAsiaEpisodes(animeTitle);

  const activeVideoId = videos?.[activeIndex]?.id?.videoId;
  const activeTitle = videos?.[activeIndex]?.snippet?.title;

  // Filter episodes by search
  const filteredVideos =
    videos?.filter((v) =>
      v.snippet?.title?.toLowerCase().includes(searchEpisode.toLowerCase()),
    ) || [];

  const goToPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goToNext = () =>
    setActiveIndex((i) => Math.min((videos?.length || 1) - 1, i + 1));

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center gap-3
                      bg-anime-card border border-anime-border
                      rounded-xl p-16"
      >
        <Loader2 size={24} className="text-anime-primary animate-spin" />
        <p className="text-anime-muted text-sm">
          Searching Muse Asia for episodes...
        </p>
      </div>
    );
  }

  // ── No Results ───────────────────────────────────────────
  if (isError || !videos?.length) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4
                      bg-anime-card border border-anime-border
                      rounded-xl p-12 text-center"
      >
        <AlertCircle size={32} className="text-anime-muted" />
        <div>
          <p className="text-anime-text font-medium mb-1">
            No episodes found on Muse Asia
          </p>
          <p className="text-anime-muted text-sm">
            This anime may not be on Muse Asia's free channel
          </p>
        </div>
        <a
          href={`https://www.youtube.com/@MuseAsia/search?query=${encodeURIComponent(animeTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700
                     text-white font-medium px-4 py-2 rounded-lg
                     transition-colors text-sm"
        >
          <Youtube size={16} />
          Search on Muse Asia YouTube
        </a>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col lg:flex-row gap-0 bg-anime-card
                    border border-anime-border rounded-xl overflow-hidden"
    >
      {/* ── Left: Episode Sidebar ────────────────────────── */}
      <div
        className="lg:w-72 shrink-0 flex flex-col
                      border-b lg:border-b-0 lg:border-r border-anime-border"
      >
        {/* Sidebar header */}
        <div className="px-4 py-3 border-b border-anime-border">
          <p className="text-anime-text font-semibold text-sm mb-2">
            List of Episodes
          </p>
          {/* Episode search */}
          <input
            type="text"
            value={searchEpisode}
            onChange={(e) => setSearchEpisode(e.target.value)}
            placeholder="Search episodes..."
            className="w-full bg-anime-bg border border-anime-border
                       text-anime-text placeholder-anime-muted rounded-lg
                       px-3 py-1.5 text-xs focus:outline-none
                       focus:border-anime-primary transition-colors"
          />
        </div>

        {/* Episode list — scrollable */}
        <div className="flex-1 overflow-y-auto max-h-64 lg:max-h-[480px] p-2">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <EpisodeItem
                key={video.id?.videoId}
                video={video}
                index={index}
                isActive={video.id?.videoId === activeVideoId}
                onClick={() => {
                  const realIndex = videos.findIndex(
                    (v) => v.id?.videoId === video.id?.videoId,
                  );
                  setActiveIndex(realIndex);
                }}
              />
            ))
          ) : (
            <p className="text-anime-muted text-xs text-center py-4">
              No episodes match your search
            </p>
          )}
        </div>

        {/* Muse Asia credit */}
        <div
          className="px-4 py-3 border-t border-anime-border
                        flex items-center gap-2"
        >
          <Youtube size={14} className="text-red-500 shrink-0" />
          <span className="text-anime-muted text-xs">
            Via Muse Asia official YouTube
          </span>
        </div>
      </div>

      {/* ── Right: Video Player ──────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Player */}
        <div className="relative w-full aspect-video bg-black">
          {activeVideoId && (
            <iframe
              key={activeVideoId}
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
              title={activeTitle}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write;
                     encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </div>

        {/* Player controls bar */}
        <div
          className="px-4 py-3 border-t border-anime-border
                        flex flex-wrap items-center justify-between gap-3"
        >
          {/* Now playing */}
          <p
            className="text-anime-text text-xs font-medium
                        line-clamp-1 flex-1 min-w-0"
          >
            {activeTitle}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Prev episode */}
            <button
              onClick={goToPrev}
              disabled={activeIndex === 0}
              className="flex items-center gap-1 text-xs font-medium
                         bg-anime-bg border border-anime-border
                         text-anime-muted hover:text-anime-primary
                         hover:border-anime-primary disabled:opacity-30
                         disabled:cursor-not-allowed px-3 py-1.5
                         rounded-lg transition-colors"
            >
              <ChevronLeft size={14} />
              Prev
            </button>

            {/* Next episode */}
            <button
              onClick={goToNext}
              disabled={activeIndex === (videos?.length || 1) - 1}
              className="flex items-center gap-1 text-xs font-medium
                         bg-anime-bg border border-anime-border
                         text-anime-muted hover:text-anime-primary
                         hover:border-anime-primary disabled:opacity-30
                         disabled:cursor-not-allowed px-3 py-1.5
                         rounded-lg transition-colors"
            >
              Next
              <ChevronRight size={14} />
            </button>

            {/* Open in YouTube */}
            <a
              href={`https://www.youtube.com/watch?v=${activeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium
                         bg-red-600 hover:bg-red-700 text-white
                         px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink size={14} />
              YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayer;
