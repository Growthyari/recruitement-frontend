import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PracticeRoom from "./pages/PracticeRoom";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import EvidenceLocker from "./pages/EvidenceLocker";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import StudentSearch from "./pages/company/StudentSearch";
import StudentProfile from "./pages/company/StudentProfile";
import Matches from "./pages/company/Matches";

import OnboardingPage from "./pages/OnboardingPage";
import EvaluationPage from "./pages/EvaluationPage";
import BaselineRevealPage from "./pages/BaselineRevealPage";
import MicroLearnPage from "./pages/MicroLearnPage";

function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function RequireOnboarding({ children }) {
  const hasOnboarding = !!localStorage.getItem("gy_onboarding");
  if (!hasOnboarding) return <Navigate to="/onboarding" replace />;
  return children;
}

function Spinner() {
  return (
    <div className="w-10 h-10 border-2 border-gray-700 border-t-grit rounded-full animate-spin" />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candidate/:username" element={<EvidenceLocker />} />

          {/* Yari Journey — no auth required */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/evaluation" element={<RequireOnboarding><EvaluationPage /></RequireOnboarding>} />
          <Route path="/baseline" element={<RequireOnboarding><BaselineRevealPage /></RequireOnboarding>} />
          <Route path="/microlearn" element={<RequireOnboarding><MicroLearnPage /></RequireOnboarding>} />

          {/* Student */}
          <Route path="/dashboard" element={<RequireAuth role="student"><Dashboard /></RequireAuth>} />
          <Route path="/practice/:id" element={<RequireAuth role="student"><PracticeRoom /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth role="student"><History /></RequireAuth>} />
          <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />

          {/* Company */}
          <Route path="/company" element={<RequireAuth role="company"><CompanyDashboard /></RequireAuth>} />
          <Route path="/company/students" element={<RequireAuth role="company"><StudentSearch /></RequireAuth>} />
          <Route path="/company/students/:id" element={<RequireAuth role="company"><StudentProfile /></RequireAuth>} />
          <Route path="/company/matches" element={<RequireAuth role="company"><Matches /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
