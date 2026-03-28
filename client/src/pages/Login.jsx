// Login.jsx — Login page with form validation
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tv, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    // Update only the field that changed
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/"); // redirect to homepage on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-anime-bg flex items-center
                    justify-center px-4"
    >
      <div className="w-full max-w-md">
        {/* ── Logo ──────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Tv size={32} className="text-anime-primary" />
          <span className="text-2xl font-bold text-anime-text">AniVerse</span>
        </div>

        {/* ── Card ──────────────────────────────────────── */}
        <div
          className="bg-anime-card border border-anime-border
                        rounded-2xl p-8"
        >
          <h1 className="text-2xl font-bold text-anime-text mb-2">
            Welcome back
          </h1>
          <p className="text-anime-muted text-sm mb-6">
            Sign in to your account
          </p>

          {/* Error message */}
          {error && (
            <div
              className="flex items-center gap-2 text-red-400
                            bg-red-400/10 border border-red-400/20
                            rounded-lg p-3 mb-4 text-sm"
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-anime-muted text-sm mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-anime-bg border border-anime-border
                           text-anime-text placeholder-anime-muted rounded-lg
                           px-4 py-3 text-sm focus:outline-none
                           focus:border-anime-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-anime-muted text-sm mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-anime-bg border border-anime-border
                           text-anime-text placeholder-anime-muted rounded-lg
                           px-4 py-3 text-sm focus:outline-none
                           focus:border-anime-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-anime-primary hover:bg-orange-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-semibold py-3 rounded-lg
                         transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Link to register */}
          <p className="text-center text-anime-muted text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-anime-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
