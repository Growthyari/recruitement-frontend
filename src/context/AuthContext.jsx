import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe } from "../services/api";

const AuthContext = createContext(null);

const MOCK_USER = import.meta.env.VITE_MOCK_AUTH === "true" ? {
  id: "dev-id", name: "Priya Sharma", email: "priya@test.com",
  username: "priya_sharma", role: "student", city: "Jaipur", college: "MNIT Jaipur", year: "3",
  level: 3, grit_score: 72, streak: 7, submissions_count: 5,
  clarity_avg: 74, persuasion_avg: 68, structure_avg: 77, confidence_avg: 65, relevance_avg: 80,
} : null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);
  const [loading, setLoading] = useState(!MOCK_USER);

  const loadUser = useCallback(async () => {
    if (MOCK_USER) return;
    const t = localStorage.getItem("gy_token");
    if (!t) { setLoading(false); return; }
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      localStorage.removeItem("gy_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const loginWith = (token, userData) => {
    localStorage.setItem("gy_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("gy_token");
    setUser(null);
  };

  const refreshUser = async () => {
    try { const me = await getMe(); setUser(me); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWith, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
