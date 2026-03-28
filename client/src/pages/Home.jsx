// Home.jsx — Main homepage with hero banner and anime rows
import HeroBanner from "../components/anime/HeroBanner";
import AnimeRow from "../components/anime/AnimeRow";
import {
  useTrendingAnime,
  useTopAnime,
  useSeasonalAnime,
} from "../hooks/useAnime";

const Home = () => {
  // Fetch all three lists in parallel — TanStack Query handles this cleanly
  const { data: trendingData, isLoading: trendingLoading } = useTrendingAnime();
  const { data: topData, isLoading: topLoading } = useTopAnime();
  const { data: seasonData, isLoading: seasonLoading } = useSeasonalAnime();

  // Pick the first trending anime for the hero banner
  const featuredAnime = trendingData?.data?.[0];

  return (
    <div className="bg-anime-bg min-h-screen">
      {/* ── Hero Banner ───────────────────────────────────── */}
      <HeroBanner anime={featuredAnime} isLoading={trendingLoading} />

      {/* ── Anime Rows ────────────────────────────────────── */}
      <div className="pb-12">
        <AnimeRow
          title="🔥 Trending Now"
          animeList={trendingData?.data}
          isLoading={trendingLoading}
          viewAllPath="/anime"
        />

        <AnimeRow
          title="⭐ Top Rated All Time"
          animeList={topData?.data}
          isLoading={topLoading}
          viewAllPath="/anime"
        />

        <AnimeRow
          title="🌸 This Season"
          animeList={seasonData?.data}
          isLoading={seasonLoading}
          viewAllPath="/anime"
        />
      </div>
    </div>
  );
};

export default Home;
