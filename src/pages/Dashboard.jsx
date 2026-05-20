import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTodayTask, getLeaderboard } from "../services/api";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import GritMeter from "../components/GritMeter";
import LevelBadge from "../components/LevelBadge";
import DimBar from "../components/DimBar";
import Icon from "../components/Icon";

const MODULE_ICONS = {
  1: "mic", 2: "format_quote", 3: "forum",
  4: "campaign", 5: "workspace_premium",
};

const LEVEL_THRESHOLDS = [0, 40, 60, 75, 85, 100];

function LevelProgress({ grit, level }) {
  const lo = LEVEL_THRESHOLDS[level - 1] || 0;
  const hi = LEVEL_THRESHOLDS[level] || 100;
  const pct = Math.min(100, ((grit - lo) / (hi - lo)) * 100);
  return (
    <div>
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon name="trending_up" size={18} className="text-primary" />
          <span className="text-label-md font-inter text-primary font-semibold">Mastery Journey</span>
        </div>
        <span className="text-label-md font-inter text-on-surface-variant">Level {level} of 5</span>
      </div>
      <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
        <div className="h-full bg-secondary rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(0,106,102,0.4)]"
          style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-label-sm font-inter text-on-surface-variant text-center">
        {grit < 85 ? `${Math.round(hi - grit)} more Grit points to Level ${level + 1}` : "Elite — Visible to Recruiters"}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [task, setTask]   = useState(null);
  const [top3, setTop3]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTodayTask(), getLeaderboard()])
      .then(([t, lb]) => { setTask(t.task || t); setTop3(lb.slice(0, 3)); })
      .finally(() => setLoading(false));
    refreshUser();
  }, []);

  const grit    = user?.grit_score || 0;
  const level   = user?.level || 1;
  const streak  = user?.streak || 0;
  const dims    = {
    Clarity:    user?.clarity_avg    || grit,
    Persuasion: user?.persuasion_avg || grit,
    Structure:  user?.structure_avg  || grit,
    Confidence: user?.confidence_avg || grit,
    Relevance:  user?.relevance_avg  || grit,
  };
  const completed = user?.submissions_count || 0;

  return (
    <div className="page bg-surface">
      <Navbar />

      <main className="page-content space-y-6 pb-8">
        {/* Greeting */}
        <div className="pt-2">
          <p className="text-label-md font-inter text-on-surface-variant">Good morning 👋</p>
          <h1 className="font-hanken font-bold text-headline-lg-mobile text-primary mt-0.5">
            {user?.name?.split(" ")[0] || "There"}
          </h1>
        </div>

        {/* Grit score card */}
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-hanken font-semibold text-headline-md text-primary">Grit Score™</h2>
              <LevelBadge level={level} />
            </div>
            <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5">
              <span className="text-base">🔥</span>
              <span className="font-inter font-bold text-on-surface text-label-md">{streak} day streak</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <GritMeter score={grit} size={150} label={`Top ${grit >= 85 ? "4%" : grit >= 70 ? "15%" : "35%"}`} />
            <div className="flex-1 w-full space-y-3">
              {Object.entries(dims).map(([k, v]) => <DimBar key={k} label={k} value={v} />)}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant">
            <LevelProgress grit={grit} level={level} />
          </div>
        </div>

        {/* Today's Task */}
        {loading ? (
          <div className="card p-6 animate-pulse">
            <div className="h-4 bg-surface-container rounded w-1/3 mb-4" />
            <div className="h-6 bg-surface-container rounded w-2/3 mb-2" />
            <div className="h-4 bg-surface-container rounded w-full" />
          </div>
        ) : task && task.id ? (
          <div className="card p-6 border-secondary/30 bg-surface-container-lowest">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container shrink-0">
                <Icon name={MODULE_ICONS[task.module] || "mic"} />
              </div>
              <div>
                <p className="text-label-sm font-inter text-on-surface-variant uppercase tracking-wider mb-1">
                  Module {task.module} · Proof Point {task.number}
                </p>
                <h3 className="font-hanken font-semibold text-headline-md text-primary">{task.title}</h3>
              </div>
            </div>
            <p className="text-body-md font-inter text-on-surface-variant mb-5 line-clamp-2">{task.concept}</p>
            <button
              onClick={() => navigate(`/practice/${task.id}`)}
              className="btn-primary w-full py-4 text-body-md"
            >
              <Icon name="mic" /> Start Today's Practice
            </button>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <Icon name="workspace_premium" size={40} className="text-secondary mx-auto mb-3" fill />
            <p className="font-hanken font-semibold text-primary text-headline-md">All 100 Proof Points Complete!</p>
            <p className="text-body-md font-inter text-on-surface-variant mt-1">You are a certified GrowthYari Graduate.</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "check_circle", value: completed, label: "Completed" },
            { icon: "local_fire_department", value: streak,   label: "Day Streak" },
            { icon: "bar_chart",    value: `${Math.round(grit)}`, label: "Grit Score" },
          ].map((s) => (
            <div key={s.label} className="card-sm text-center">
              <Icon name={s.icon} fill className="text-secondary mb-1" size={22} />
              <p className="font-hanken font-bold text-primary text-headline-md">{s.value}</p>
              <p className="text-label-sm font-inter text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Leaderboard peek */}
        {top3.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-hanken font-semibold text-headline-md text-primary">Leaderboard</h3>
              <button onClick={() => navigate("/leaderboard")} className="text-label-md font-inter text-secondary font-semibold">
                See all →
              </button>
            </div>
            <div className="space-y-3">
              {top3.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="w-6 text-label-sm font-inter text-on-surface-variant font-semibold">{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm">
                    {s.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-semibold text-on-surface text-body-md truncate">{s.name}</p>
                    <p className="text-label-sm font-inter text-on-surface-variant">{s.college}</p>
                  </div>
                  <span className="badge-teal">{Math.round(s.grit_score)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav role="student" />
    </div>
  );
}
