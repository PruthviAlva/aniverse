// authService.js — All auth API calls to our Express backend
const BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// ─── Helper: get token from localStorage ───────────────────
const getToken = () => localStorage.getItem("aniverse_token");

// ─── Register ──────────────────────────────────────────────
export const registerUser = async (email, username, password) => {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
};

// ─── Login ─────────────────────────────────────────────────
export const loginUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
};

// ─── Get Current User ──────────────────────────────────────
export const getCurrentUser = async () => {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
};