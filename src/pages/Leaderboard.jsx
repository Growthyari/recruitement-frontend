import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getLeaderboard } from "../services/api";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import LevelBadge from "../components/LevelBadge";
import Icon from "../components/Icon";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const { user } = useAuth();
  const [list, setList]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(setList).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page bg-surface">
      <Navbar title="Leaderboard" />

      <main className="page-content pb-8">
        <div className="pt-2 mb-6">
          <h1 className="font-hanken font-bold text-headline-lg-mobile text-primary">Top Performers</h1>
          <p className="text-body-md font-inter text-on-surface-variant mt-1">Ranked by verified Grit Score</p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="card-sm animate-pulse h-16" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="card p-0 overflow-hidden divide-y divide-outline-variant">
            {list.map((s, i) => {
              const isMe = s.id === user?.id;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${isMe ? "bg-secondary-container/20" : "hover:bg-surface-container-low"}`}
                >
                  <span className="w-8 text-center font-hanken font-bold text-primary">
                    {i < 3 ? MEDALS[i] : <span className="text-on-surface-variant text-label-md">{i + 1}</span>}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm shrink-0">
                    {s.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-inter font-semibold text-body-md truncate ${isMe ? "text-secondary" : "text-on-surface"}`}>
                        {s.name} {isMe && "(You)"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-label-sm font-inter text-on-surface-variant truncate">{s.city}</p>
                      {s.streak > 0 && (
                        <span className="flex items-center gap-0.5 text-label-sm font-inter text-on-surface-variant">
                          🔥{s.streak}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="badge-teal">{Math.round(s.grit_score)}</span>
                    <LevelBadge level={s.level} />
                  </div>
                </div>
              );
            })}

            {list.length === 0 && (
              <div className="text-center py-16">
                <Icon name="leaderboard" size={48} className="text-on-surface-variant mx-auto mb-4" />
                <p className="font-hanken font-semibold text-on-surface">No data yet</p>
                <p className="text-body-md font-inter text-on-surface-variant mt-1">Complete sessions to appear here.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav role={user?.role || "student"} />
    </div>
  );
}
