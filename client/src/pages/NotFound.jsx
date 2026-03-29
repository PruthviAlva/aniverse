// NotFound.jsx — 404 page
import { Link } from "react-router-dom";
import { Tv } from "lucide-react";

const NotFound = () => (
  <div
    className="min-h-screen bg-anime-bg flex flex-col
                  items-center justify-center gap-6 px-4"
  >
    <Tv size={64} className="text-anime-border" />
    <div className="text-center">
      <h1 className="text-6xl font-bold text-anime-primary mb-2">404</h1>
      <h2 className="text-2xl font-bold text-anime-text mb-2">
        Page Not Found
      </h2>
      <p className="text-anime-muted text-sm">
        The page you're looking for doesn't exist.
      </p>
    </div>
    <Link
      to="/"
      className="bg-anime-primary hover:bg-orange-600 text-white
                 font-semibold px-6 py-3 rounded-lg transition-colors"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFound;
