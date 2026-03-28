// ProtectedRoute.jsx — Redirects to login if user is not authenticated
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Still checking localStorage for existing token — show spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-anime-bg flex items-center justify-center">
        <Loader2 size={32} className="text-anime-primary animate-spin" />
      </div>
    );
  }

  // Not logged in — redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in — render the protected page
  return children;
};

export default ProtectedRoute;