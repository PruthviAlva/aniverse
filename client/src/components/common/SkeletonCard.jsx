// SkeletonCard.jsx — Loading placeholder for AnimeCard
const SkeletonCard = () => {
  return (
    <div className="flex flex-col bg-anime-card border border-anime-border
                    rounded-xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[3/4] bg-anime-border" />

      {/* Text placeholders */}
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-anime-border rounded w-full" />
        <div className="h-3 bg-anime-border rounded w-2/3" />
      </div>
    </div>
  );
};

export default SkeletonCard;