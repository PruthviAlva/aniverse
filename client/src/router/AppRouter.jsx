// AppRouter.jsx — Central routing config for the entire app
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "../components/layout/Navbar";

// Pages
import Home from "../pages/Home";
import Search from "../pages/Search";
import AnimeDetails from "../pages/AnimeDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Protected route wrapper
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Navbar appears on every page */}
      <Navbar />

      {/* Main content area — each route swaps the page component */}
      <main className="min-h-screen bg-anime-bg">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — login required */}
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                {/* Watchlist page coming in Phase 5 */}
                <div className="p-8 text-anime-text">
                  Watchlist coming soon!
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default AppRouter;
