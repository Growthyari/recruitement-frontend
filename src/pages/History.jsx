import { useEffect, useState } from "react";
import { getMySubmissions } from "../services/api";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import DimBar from "../components/DimBar";
import Icon from "../components/Icon";

function SessionCard({ session }) {
  const [open, setOpen] = useState(false);
  const date = session.created_at
    ? new Date(session.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <div className="card-sm border border-outline-variant">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center shrink-0">
            <Icon name="mic" size={20} className="text-on-secondary-container" />
          </div>
          <div>
            <p className="font-hanken font-semibold text-on-surface text-body-md line-clamp-1">
              {session.task_title || session.task_id || "Session"}
            </p>
            <p className="text-label-md font-inter text-on-surface-variant">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="badge-teal">{Math.round(session.grit_score)}</span>
          <Icon name={open ? "expand_less" : "expand_more"} className="text-on-surface-variant" />
        </div>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-outline-variant space-y-4 animate-slide-up">
          <div className="space-y-2.5">
            {["clarity", "persuasion", "structure", "confidence", "relevance"].map((d) => (
              <DimBar key={d} label={d.charAt(0).toUpperCase() + d.slice(1)} value={session[d] || 0} />
            ))}
          </div>
          {session.highlight && (
            <div className="flex gap-2 text-label-md font-inter text-on-surface-variant bg-secondary-container/20 rounded-lg p-3">
              <Icon name="star" fill size={16} className="text-secondary shrink-0 mt-0.5" />
              <span>{session.highlight}</span>
            </div>
          )}
          {session.improvement && (
            <div className="flex gap-2 text-label-md font-inter text-on-surface-variant bg-surface-container rounded-lg p-3">
              <Icon name="lightbulb" size={16} className="text-secondary shrink-0 mt-0.5" />
              <span>{session.improvement}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getMySubmissions().then(setSessions).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page bg-surface">
      <Navbar title="My Sessions" />

      <main className="page-content pb-8 space-y-4">
        <div className="pt-2">
          <h1 className="font-hanken font-bold text-headline-lg-mobile text-primary">Session History</h1>
          <p className="text-body-md font-inter text-on-surface-variant mt-1">
            {sessions.length} practice session{sessions.length !== 1 ? "s" : ""} completed
          </p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-sm animate-pulse">
                <div className="h-10 bg-surface-container rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-center py-16">
            <Icon name="mic_off" size={48} className="text-on-surface-variant mx-auto mb-4" />
            <p className="font-hanken font-semibold text-on-surface text-headline-md">No sessions yet</p>
            <p className="text-body-md font-inter text-on-surface-variant mt-1">Complete your first proof point to see your history here.</p>
          </div>
        )}

        {!loading && sessions.map((s) => <SessionCard key={s.id} session={s} />)}
      </main>

      <BottomNav role="student" />
    </div>
  );
}
