// Navbar.jsx — Responsive navigation bar (mobile + desktop)
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Tv, Search, Heart, LogIn } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

// Navigation links config — easy to add more later
const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Anime", path: "/anime" },
  { label: "Manga", path: "/manga" },
  { label: "Search", path: "/search" },
];

const Navbar = () => {
  const { user, logout } = useAuth();

  // Controls mobile menu open/close
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useLocation lets us highlight the active nav link
  const { pathname } = useLocation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-anime-card border-b border-anime-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ───────────────────────────────────────── */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-anime-primary font-bold text-xl"
          >
            <Tv size={24} />
            <span>AniVerse</span>
          </Link>

          {/* ── Desktop Nav Links ───────────────────────────── */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-anime-primary 
              ${
                pathname === link.path
                  ? "text-anime-primary border-b-2 border-anime-primary pb-0.5"
                  : "text-anime-muted"
              }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop Right Actions ────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/search"
              className="p-2 text-anime-muted hover:text-anime-primary transition-colors"
            >
              <Search size={20} />
            </Link>

            <Link
              to="/watchlist"
              className="p-2 text-anime-muted hover:text-anime-primary transition-colors"
            >
              <Heart size={20} />
            </Link>

            {user ? (
              // Logged in — show username + logout
              <div className="flex items-center gap-3">
                <span className="text-anime-muted text-sm">
                  Hi,{" "}
                  <span className="text-anime-primary font-semibold">
                    {user.username}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-medium px-3 py-1.5 rounded-lg
                             border border-anime-border text-anime-muted
                             hover:border-anime-primary hover:text-anime-primary
                             transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Logged out — show login button
              <Link
                to="/login"
                className="flex items-center gap-2 bg-anime-primary hover:bg-orange-600
                 text-white text-sm font-medium px-4 py-2 rounded-lg
                 transition-colors"
              >
                <LogIn size={16} />
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile Hamburger Button ──────────────────────── */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-anime-muted hover:text-anime-primary transition-colors"
            aria-label="Toggle menu"
          >
            {/* Switch between hamburger and X icon */}
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ─────────────────────────────── */}
      {isMenuOpen && (
        <div className="md:hidden bg-anime-card border-t border-anime-border px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Mobile nav links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`text-sm font-medium transition-colors hover:text-anime-primary
                  ${
                    pathname === link.path
                      ? "text-anime-primary"
                      : "text-anime-muted"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <hr className="border-anime-border" />

            {/* Mobile login button */}
            <Link
              to="/login"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 bg-anime-primary
                         hover:bg-orange-600 text-white text-sm font-medium
                         px-4 py-2 rounded-lg transition-colors w-full"
            >
              <LogIn size={16} />
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
