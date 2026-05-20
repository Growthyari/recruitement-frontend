import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMatches, getStudents } from "../../services/api";
import CompanyLayout from "./CompanyLayout";
import Icon from "../../components/Icon";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [recentPool, setRecentPool] = useState([]);

  useEffect(() => {
    getMatches().then(setMatches).catch(() => {});
    getStudents({ limit: 5 }).then(setRecentPool).catch(() => {});
  }, []);

  const stats = [
    { icon: "group",        label: "Verified Candidates", value: recentPool.length + "+" },
    { icon: "analytics",    label: "Your Matches",        value: matches.length },
    { icon: "star",         label: "Avg Grit Score",      value: matches.length
        ? Math.round(matches.reduce((a, m) => a + (m.student?.grit_score || 0), 0) / matches.length)
        : "—" },
  ];

  return (
    <CompanyLayout>
      <div className="max-w-[1200px] mx-auto p-gutter">
        {/* Header */}
        <div className="mb-8">
          <p className="font-inter text-label-md text-on-surface-variant">Welcome back,</p>
          <h1 className="font-hanken font-bold text-headline-xl text-primary mt-0.5">{user?.name}</h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-8">
          {stats.map((s) => (
            <div key={s.label} className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center shrink-0">
                <Icon name={s.icon} className="text-on-secondary-container" size={24} />
              </div>
              <div>
                <p className="font-hanken font-bold text-primary text-headline-lg">{s.value}</p>
                <p className="font-inter text-label-md text-on-surface-variant">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="card p-6">
            <h2 className="font-hanken font-semibold text-headline-md text-primary mb-4">Find Talent</h2>
            <p className="font-inter text-body-md text-on-surface-variant mb-5">
              Browse 128+ verified candidates filtered by Grit Score, city, and skills.
            </p>
            <button onClick={() => navigate("/company/students")} className="btn-primary w-full py-3">
              <Icon name="search" /> Browse Candidates
            </button>
          </div>
          <div className="card p-6">
            <h2 className="font-hanken font-semibold text-headline-md text-primary mb-4">Top Matches</h2>
            <p className="font-inter text-body-md text-on-surface-variant mb-5">
              AI-matched candidates based on your open roles and Grit Score thresholds.
            </p>
            <button onClick={() => navigate("/company/matches")} className="btn-primary w-full py-3">
              <Icon name="analytics" /> View Matches
            </button>
          </div>
        </div>

        {/* Recent candidates preview */}
        {recentPool.length > 0 && (
          <div className="card mt-8 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
              <h2 className="font-hanken font-semibold text-headline-md text-on-surface">Recently Active</h2>
              <button onClick={() => navigate("/company/students")}
                className="font-inter text-label-md text-secondary font-semibold">View all →</button>
            </div>
            <div className="divide-y divide-outline-variant">
              {recentPool.slice(0, 4).map((s) => (
                <button key={s.id} onClick={() => navigate(`/company/students/${s.id}`)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low text-left transition-colors">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm">
                    {s.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-semibold text-on-surface text-body-md">{s.name}</p>
                    <p className="font-inter text-label-md text-on-surface-variant">{s.city} · {s.college}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="badge-teal">{Math.round(s.grit_score)}</span>
                    <Icon name="chevron_right" className="text-on-surface-variant" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
}
