// AppRouter.jsx — Central routing config for the entire app
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "../components/layout/Navbar";

// Pages
import Home from "../pages/Home";
import Search from "../pages/Search";
import AnimeDetails from "../pages/AnimeDetails";

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Navbar appears on every page */}
      <Navbar />

      {/* Main content area — each route swaps the page component */}
      <main className="min-h-screen bg-anime-bg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          {/* We'll add more routes as we build each page */}
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default AppRouter;
