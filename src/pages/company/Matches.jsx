import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../../services/api";
import CompanyLayout from "./CompanyLayout";
import LevelBadge from "../../components/LevelBadge";
import Icon from "../../components/Icon";

function MatchScore({ score }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? "text-secondary" : pct >= 60 ? "text-yellow-600" : "text-on-surface-variant";
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 relative shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#dee8ff" strokeWidth="4" />
          <circle cx="20" cy="20" r="16" fill="none" stroke="#006a66" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="100.5"
            strokeDashoffset={100.5 - (pct / 100) * 100.5} />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${color}`}>{pct}%</span>
      </div>
      <span className={`font-inter font-semibold text-label-md ${color}`}>Match</span>
    </div>
  );
}

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMatches().then(setMatches).finally(() => setLoading(false)); }, []);

  return (
    <CompanyLayout>
      <div className="max-w-[1200px] mx-auto p-gutter">
        <div className="mb-6">
          <h1 className="font-hanken font-bold text-headline-xl text-primary">Your Matches</h1>
          <p className="font-inter text-body-md text-on-surface-variant mt-1">
            AI-ranked candidates matched to your active roles.
          </p>
        </div>

        {loading && (
          <div className="card p-0 animate-pulse">
            {[1,2,3].map((i) => (
              <div key={i} className="h-20 border-b border-outline-variant px-6 py-4">
                <div className="h-4 bg-surface-container rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="text-center py-24">
            <Icon name="manage_search" size={52} className="text-on-surface-variant mx-auto mb-4" />
            <h2 className="font-hanken font-bold text-primary text-headline-md">No matches yet</h2>
            <p className="font-inter text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
              Create a role first, then Level 5 students (Grit ≥ 85) will be auto-matched to it.
            </p>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-outline-variant">
              <h2 className="font-hanken font-semibold text-headline-md text-on-surface">
                Matched Candidates <span className="text-on-surface-variant font-normal">({matches.length})</span>
              </h2>
            </div>
            <div className="divide-y divide-outline-variant">
              {matches.map((m) => {
                const s = m.student || {};
                return (
                  <div key={m.id}
                    className="flex items-center gap-4 px-6 py-5 hover:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() => navigate(`/company/students/${m.student_id}`)}>
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary shrink-0">
                      {s.name?.split(" ").map((n) => n[0]).join("") || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter font-bold text-on-surface text-body-md">{s.name || "—"}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="font-inter text-label-md text-on-surface-variant">{s.city}</p>
                        {s.grit_score && <span className="badge-teal">{Math.round(s.grit_score)}</span>}
                        {s.level && <LevelBadge level={s.level} />}
                      </div>
                    </div>
                    <MatchScore score={m.match_score} />
                    <span className={`badge font-inter text-label-sm px-3 py-1 rounded-full ${
                      m.status === "shortlisted"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container text-on-surface-variant"
                    }`}>
                      {m.status}
                    </span>
                    <Icon name="chevron_right" className="text-on-surface-variant shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
}
