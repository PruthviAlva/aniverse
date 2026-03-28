// Register.jsx — Sign up page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tv, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (formData.username.length < 3) {
      return setError("Username must be at least 3 characters");
    }

    setLoading(true);
    setError("");

    try {
      await register(formData.email, formData.username, formData.password);
      navigate("/"); // redirect on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-anime-bg flex items-center
                    justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Tv size={32} className="text-anime-primary" />
          <span className="text-2xl font-bold text-anime-text">AniVerse</span>
        </div>

        {/* Card */}
        <div className="bg-anime-card border border-anime-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-anime-text mb-2">
            Create account
          </h1>
          <p className="text-anime-muted text-sm mb-6">
            Join AniVerse and start tracking your anime
          </p>

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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "you@example.com",
              },
              {
                label: "Username",
                name: "username",
                type: "text",
                placeholder: "coolotaku123",
              },
              {
                label: "Password",
                name: "password",
                type: "password",
                placeholder: "••••••••",
              },
              {
                label: "Confirm Password",
                name: "confirmPassword",
                type: "password",
                placeholder: "••••••••",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-anime-muted text-sm mb-1.5 block">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-anime-bg border border-anime-border
                             text-anime-text placeholder-anime-muted rounded-lg
                             px-4 py-3 text-sm focus:outline-none
                             focus:border-anime-primary transition-colors"
                />
              </div>
            ))}

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
                  <Loader2 size={18} className="animate-spin" /> Creating
                  account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-anime-muted text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-anime-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
