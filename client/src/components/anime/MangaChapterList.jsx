// MangaChapterList.jsx — Shows chapters sidebar for a manga
import { useState } from "react";
import { BookOpen, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useMangaDexSearch, useMangaChapters } from "../../hooks/useMangaDex";

const MangaChapterList = ({ mangaTitle, onChapterSelect, activeChapterId }) => {
  const [page, setPage] = useState(1);

  // Step 1 — Find the manga on MangaDex by title
  const { data: searchData, isLoading: searching } = useMangaDexSearch(mangaTitle);

  // Pick the best match — first result
  const mangaDexId = searchData?.data?.[0]?.id;

  // Step 2 — Fetch chapters using the MangaDex ID
  const {
    data:      chaptersData,
    isLoading: loadingChapters,
  } = useMangaChapters(mangaDexId, page);

  const chapters   = chaptersData?.data     || [];
  const total      = chaptersData?.total    || 0;
  const totalPages = Math.ceil(total / 40);

  // ── Loading ──────────────────────────────────────────────
  if (searching || loadingChapters) {
    return (
      <div className="flex flex-col items-center justify-center
                      gap-3 py-12">
        <Loader2 size={24} className="text-anime-primary animate-spin" />
        <p className="text-anime-muted text-xs">
          {searching ? "Finding manga..." : "Loading chapters..."}
        </p>
      </div>
    );
  }

  // ── Not Found ────────────────────────────────────────────
  if (!mangaDexId || chapters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center
                      gap-3 py-12 text-center px-4">
        <AlertCircle size={24} className="text-anime-muted" />
        <p className="text-anime-text text-sm font-medium">
          Not found on MangaDex
        </p>
        <a
          href={`https://mangadex.org/search?q=${encodeURIComponent(mangaTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-anime-primary hover:underline text-xs"
        >
          Search on MangaDex →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-4 py-3 border-b border-anime-border">
        <p className="text-anime-text font-semibold text-sm">
          Chapters
        </p>
        <p className="text-anime-muted text-xs mt-0.5">
          {total} chapters available
        </p>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto max-h-[420px]">
        {chapters.map((chapter) => {
          const attrs     = chapter.attributes;
          const chNum     = attrs.chapter    || "?";
          const chTitle   = attrs.title      || `Chapter ${chNum}`;
          const isActive  = chapter.id === activeChapterId;

          return (
            <button
              key={chapter.id}
              onClick={() => onChapterSelect(chapter.id, chNum, chTitle)}
              className={`flex items-center gap-3 w-full text-left
                          px-4 py-3 border-b border-anime-border/50
                          transition-colors border-l-2
                          ${isActive
                            ? "bg-anime-primary/10 border-l-anime-primary"
                            : "border-l-transparent hover:bg-anime-border/20"
                          }`}
            >
              {/* Chapter number badge */}
              <span className={`shrink-0 text-xs font-bold px-2 py-1
                                rounded-lg min-w-[48px] text-center
                                ${isActive
                                  ? "bg-anime-primary text-white"
                                  : "bg-anime-border text-anime-muted"
                                }`}>
                Ch.{chNum}
              </span>

              {/* Chapter title */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs line-clamp-1 font-medium
                               ${isActive
                                 ? "text-anime-primary"
                                 : "text-anime-text"
                               }`}>
                  {chTitle}
                </p>
                {/* Volume info if available */}
                {attrs.volume && (
                  <p className="text-anime-muted text-xs">
                    Vol. {attrs.volume}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination for chapters */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3
                        border-t border-anime-border">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs text-anime-muted
                       hover:text-anime-primary disabled:opacity-30
                       disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
            Prev
          </button>

          <span className="text-anime-muted text-xs">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs text-anime-muted
                       hover:text-anime-primary disabled:opacity-30
                       disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}

    </div>
  );
};

export default MangaChapterList;