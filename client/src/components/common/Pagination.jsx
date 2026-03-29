// Pagination.jsx — Reusable pagination controls
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // ── Build page numbers to display ───────────────────────
  // Always show: first, last, current, and 2 siblings around current
  // Everything else becomes "..." ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // how many pages to show around current

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Always include page 1
    pages.push(1);

    // Left ellipsis
    if (rangeStart > 2) pages.push("...");

    // Pages around current
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (rangeEnd < totalPages - 1) pages.push("...");

    // Always include last page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      {/* ── Prev Button ─────────────────────────────────── */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm
                   font-medium border border-anime-border text-anime-muted
                   hover:border-anime-primary hover:text-anime-primary
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors bg-anime-card"
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {/* ── Page Numbers ────────────────────────────────── */}
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          // Ellipsis — not clickable
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-anime-muted text-sm"
          >
            ...
          </span>
        ) : (
          // Page number button
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg text-sm font-medium
                        border transition-colors
                        ${
                          currentPage === page
                            ? "bg-anime-primary border-anime-primary text-white"
                            : "bg-anime-card border-anime-border text-anime-muted hover:border-anime-primary hover:text-anime-primary"
                        }`}
          >
            {page}
          </button>
        ),
      )}

      {/* ── Next Button ─────────────────────────────────── */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm
                   font-medium border border-anime-border text-anime-muted
                   hover:border-anime-primary hover:text-anime-primary
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors bg-anime-card"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
