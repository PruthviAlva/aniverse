// MangaPageReader.jsx — Displays manga pages one by one or all at once
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LayoutList,
  BookOpen,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useChapterPages } from "../../hooks/useMangaDex";

const MangaPageReader = ({ chapterId, chapterTitle }) => {
  const [mode, setMode] = useState("scroll"); // "scroll" | "single"
  const [pageIdx, setPageIdx] = useState(0);
  const [zoom, setZoom] = useState(100);

  const { data, isLoading, isError, error } = useChapterPages(chapterId);
  const pages = data?.pages || [];

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center
                      gap-3 py-24 bg-black rounded-xl"
      >
        <Loader2 size={28} className="text-anime-primary animate-spin" />
        <p className="text-anime-muted text-sm">Loading chapter pages...</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  // Replace the existing isError block with this:
  if (isError) {
    const isUnavailable = error?.message === "CHAPTER_UNAVAILABLE";

    return (
      <div
        className="flex flex-col items-center justify-center gap-4
                    bg-black rounded-xl py-24 px-8 text-center"
      >
        <BookOpen size={40} className="text-anime-muted" />

        {isUnavailable ? (
          <>
            <div>
              <p className="text-anime-text font-semibold mb-2">
                Chapter Not Available
              </p>
              <p className="text-anime-muted text-sm max-w-md">
                This chapter has been removed from MangaDex due to publisher
                licensing (common for One Piece, Naruto, Dragon Ball). Try a
                different chapter or read on an official platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://www.viz.com/shonenjump"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-anime-primary hover:bg-orange-600 text-white
                         text-sm font-medium px-4 py-2 rounded-lg
                         transition-colors"
              >
                Read on VIZ (Official)
              </a>
              <a
                href="https://mangaplus.shueisha.co.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-anime-card border border-anime-border
                         text-anime-text hover:border-anime-primary
                         text-sm font-medium px-4 py-2 rounded-lg
                         transition-colors"
              >
                Read on MANGA Plus (Free)
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="text-anime-text font-semibold">
              Failed to load pages
            </p>
            <p className="text-anime-muted text-sm">
              Please try another chapter
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-black rounded-xl overflow-hidden">
      {/* ── Reader Toolbar ────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-3
                      bg-anime-card border-b border-anime-border flex-wrap gap-3"
      >
        {/* Chapter info */}
        <p className="text-anime-text text-sm font-medium">{chapterTitle}</p>

        <div className="flex items-center gap-2">
          {/* Zoom controls — only for scroll mode */}
          {mode === "scroll" && (
            <>
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-1.5 text-anime-muted hover:text-anime-primary
                           transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-anime-muted text-xs w-10 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
                className="p-1.5 text-anime-muted hover:text-anime-primary
                           transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
            </>
          )}

          {/* Mode toggle */}
          <div
            className="flex items-center bg-anime-bg border
                          border-anime-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setMode("scroll")}
              title="Scroll mode"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs
                          font-medium transition-colors
                          ${
                            mode === "scroll"
                              ? "bg-anime-primary text-white"
                              : "text-anime-muted hover:text-anime-primary"
                          }`}
            >
              <LayoutList size={14} />
              Scroll
            </button>
            <button
              onClick={() => {
                setMode("single");
                setPageIdx(0);
              }}
              title="Single page mode"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs
                          font-medium transition-colors
                          ${
                            mode === "single"
                              ? "bg-anime-primary text-white"
                              : "text-anime-muted hover:text-anime-primary"
                          }`}
            >
              <BookOpen size={14} />
              Single
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll Mode — all pages stacked ─────────────────── */}
      {mode === "scroll" && (
        <div
          className="overflow-y-auto max-h-[80vh] flex flex-col items-center
                        bg-gray-950 py-4 gap-1"
        >
          {pages.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Page ${i + 1}`}
              loading="lazy"
              style={{ width: `${zoom}%`, maxWidth: "100%" }}
              className="object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ))}
        </div>
      )}

      {/* ── Single Page Mode ─────────────────────────────────── */}
      {mode === "single" && (
        <>
          {/* Page display */}
          <div
            className="flex items-center justify-center bg-gray-950
                          min-h-[60vh] relative"
          >
            <img
              src={pages[pageIdx]}
              alt={`Page ${pageIdx + 1}`}
              className="max-h-[75vh] max-w-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />

            {/* Left click zone — prev page */}
            <button
              onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
              disabled={pageIdx === 0}
              className="absolute left-0 top-0 h-full w-1/3
                         flex items-center justify-start pl-4
                         opacity-0 hover:opacity-100 transition-opacity
                         disabled:cursor-not-allowed"
            >
              <div className="bg-black/60 rounded-full p-2">
                <ChevronLeft size={24} className="text-white" />
              </div>
            </button>

            {/* Right click zone — next page */}
            <button
              onClick={() =>
                setPageIdx((p) => Math.min(pages.length - 1, p + 1))
              }
              disabled={pageIdx === pages.length - 1}
              className="absolute right-0 top-0 h-full w-1/3
                         flex items-center justify-end pr-4
                         opacity-0 hover:opacity-100 transition-opacity
                         disabled:cursor-not-allowed"
            >
              <div className="bg-black/60 rounded-full p-2">
                <ChevronRight size={24} className="text-white" />
              </div>
            </button>
          </div>

          {/* Page controls bar */}
          <div
            className="flex items-center justify-between px-4 py-3
                          bg-anime-card border-t border-anime-border"
          >
            <button
              onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
              disabled={pageIdx === 0}
              className="flex items-center gap-1 text-xs font-medium
                         bg-anime-bg border border-anime-border
                         text-anime-muted hover:text-anime-primary
                         hover:border-anime-primary disabled:opacity-30
                         disabled:cursor-not-allowed px-3 py-1.5
                         rounded-lg transition-colors"
            >
              <ChevronLeft size={14} />
              Prev Page
            </button>

            {/* Page counter */}
            <div className="flex items-center gap-2">
              <span className="text-anime-text font-medium text-sm">
                {pageIdx + 1}
              </span>
              <span className="text-anime-muted text-sm">/</span>
              <span className="text-anime-muted text-sm">{pages.length}</span>
            </div>

            <button
              onClick={() =>
                setPageIdx((p) => Math.min(pages.length - 1, p + 1))
              }
              disabled={pageIdx === pages.length - 1}
              className="flex items-center gap-1 text-xs font-medium
                         bg-anime-bg border border-anime-border
                         text-anime-muted hover:text-anime-primary
                         hover:border-anime-primary disabled:opacity-30
                         disabled:cursor-not-allowed px-3 py-1.5
                         rounded-lg transition-colors"
            >
              Next Page
              <ChevronRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MangaPageReader;
