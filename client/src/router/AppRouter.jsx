// AppRouter.jsx — Central routing config for the entire app
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Layout
import Navbar from "../components/layout/Navbar";

// Pages
// ── Lazy load every page — loads only when route is visited ──
const Home = lazy(() => import("../pages/Home"));
const Anime = lazy(() => import("../pages/Anime"));
const Manga = lazy(() => import("../pages/Manga"));
const Search = lazy(() => import("../pages/Search"));
const AnimeDetails = lazy(() => import("../pages/AnimeDetails"));
const MangaDetails = lazy(() => import("../pages/MangaDetails"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Watchlist = lazy(() => import("../pages/Watchlist"));
const MangaReader = lazy(() => import("../pages/MangaReader"));

const NotFound = lazy(() => import("../pages/NotFound"));

// Protected route wrapper
import ProtectedRoute from "./ProtectedRoute";

// ── Shown while a lazy page is loading ──────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-anime-bg flex items-center justify-center">
    <Loader2 size={32} className="text-anime-primary animate-spin" />
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Navbar appears on every page */}
      <Navbar />

      {/* Main content area — each route swaps the page component */}
      <main className="min-h-screen bg-anime-bg">
        {/* Suspense shows PageLoader while lazy page loads */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/manga" element={<Manga />} />
            <Route path="/search" element={<Search />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/manga/:id" element={<MangaDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/manga/:id/read" element={<MangaReader />} />

            {/* Protected routes — login required */}
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default AppRouter;
