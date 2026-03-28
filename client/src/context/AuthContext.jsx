// AuthContext.jsx — Global auth state shared across all components
import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, registerUser } from "../services/authService";

// Create the context
const AuthContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // checking if already logged in

  // On app start — check if a valid token exists in localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ─── Login ───────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await loginUser(email, password);

    // Store token in localStorage
    localStorage.setItem("aniverse_token", data.token);
    setUser(data.user);

    return data;
  };

  // ─── Register ────────────────────────────────────────────
  const register = async (email, username, password) => {
    const data = await registerUser(email, username, password);

    localStorage.setItem("aniverse_token", data.token);
    setUser(data.user);

    return data;
  };

  // ─── Logout ──────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("aniverse_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────
// Any component can call useAuth() to access user + auth functions
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};