// MangaReader.jsx — Full manga reading experience
import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useMangaById } from "../hooks/useAnime";
import MangaChapterList from "../components/anime/MangaChapterList";
import MangaPageReader from "../components/anime/MangaPageReader";

const MangaReader = () => {
  const { id } = useParams();
  const { data, isLoading } = useMangaById(id);

  const [activeChapterId, setActiveChapterId] = useState(null);
  const [activeChapterNum, setActiveChapterNum] = useState(null);
  const [activeChapterTitle, setActiveChapterTitle] = useState(null);

  const readerRef = useRef(null);

  const manga = data?.data;
  const displayTitle = manga?.title_english || manga?.title;

  const handleChapterSelect = (chapterId, chapterNum, chapterTitle) => {
    setActiveChapterId(chapterId);
    setActiveChapterNum(chapterNum);
    setActiveChapterTitle(
      `Chapter ${chapterNum}${chapterTitle !== `Chapter ${chapterNum}` ? ` — ${chapterTitle}` : ""}`,
    );

    // Scroll to reader
    setTimeout(() => {
      readerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-anime-bg flex items-center justify-center">
        <BookOpen size={32} className="text-anime-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-anime-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Back Button ─────────────────────────────────── */}
        <Link
          to={`/manga/${id}`}
          className="inline-flex items-center gap-2 text-anime-muted
                     hover:text-anime-primary transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Back to {displayTitle}
        </Link>

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-6">
          {manga?.images?.jpg?.image_url && (
            <img
              src={manga.images.jpg.image_url}
              alt={displayTitle}
              className="w-12 h-16 object-cover rounded-lg border border-anime-border"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-anime-text">
              {displayTitle}
            </h1>
            {activeChapterTitle && (
              <p className="text-anime-primary text-sm font-medium mt-0.5">
                Reading: {activeChapterTitle}
              </p>
            )}
          </div>
        </div>

        {/* ── Main Layout: Chapters + Reader ──────────────── */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left: Chapter list sidebar */}
          <div
            className="lg:w-72 shrink-0 bg-anime-card border
                          border-anime-border rounded-xl overflow-hidden
                          self-start lg:sticky lg:top-20"
          >
            <MangaChapterList
              mangaTitle={displayTitle}
              onChapterSelect={handleChapterSelect}
              activeChapterId={activeChapterId}
            />
          </div>

          {/* Right: Reader */}
          <div className="flex-1" ref={readerRef}>
            {activeChapterId ? (
              <MangaPageReader
                chapterId={activeChapterId}
                chapterTitle={activeChapterTitle}
              />
            ) : (
              // Empty state — prompt user to pick a chapter
              <div
                className="flex flex-col items-center justify-center
                                gap-4 bg-anime-card border border-anime-border
                                rounded-xl py-24 px-8 text-center"
              >
                <BookOpen size={48} className="text-anime-border" />
                <div>
                  <p className="text-anime-text font-semibold mb-1">
                    Select a chapter to start reading
                  </p>
                  <p className="text-anime-muted text-sm">
                    Choose any chapter from the list on the left
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaReader;
