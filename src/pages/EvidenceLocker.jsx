import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicProfile } from "../services/api";
import GritMeter from "../components/GritMeter";
import LevelBadge from "../components/LevelBadge";
import DimBar from "../components/DimBar";
import Icon from "../components/Icon";

export default function EvidenceLocker() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError]     = useState(false);

  useEffect(() => {
    getPublicProfile(username)
      .then((p) => { if (p.detail) setError(true); else setProfile(p); })
      .catch(() => setError(true));
  }, [username]);

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center">
        <Icon name="lock" size={52} className="text-on-surface-variant mx-auto mb-4" />
        <h1 className="font-hanken font-bold text-primary text-headline-md">Profile not available</h1>
        <p className="font-inter text-body-md text-on-surface-variant mt-2 max-w-sm">
          This candidate hasn't reached Level 3 yet, or the username doesn't exist.
        </p>
        <Link to="/" className="btn-primary mt-6 px-6 py-3">Go to GrowthYari</Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-outline-variant border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  const dims = [
    { label: "Clarity",    value: profile.clarity_avg    || profile.grit_score },
    { label: "Persuasion", value: profile.persuasion_avg || profile.grit_score },
    { label: "Structure",  value: profile.structure_avg  || profile.grit_score },
    { label: "Confidence", value: profile.confidence_avg || profile.grit_score },
    { label: "Relevance",  value: profile.relevance_avg  || profile.grit_score },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface-bright/90 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-[900px] mx-auto px-container-margin-mobile h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 140 L100 60 L140 140" fill="none" stroke="#006a66" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M80 105 L120 105" fill="none" stroke="#002451" strokeWidth="20" strokeLinecap="round"/>
            </svg>
            <span className="font-hanken font-bold text-primary text-headline-md">GrowthYari</span>
          </Link>
          <div className="flex items-center gap-2 bg-secondary-container/30 border border-secondary/20 rounded-full px-3 py-1">
            <Icon name="verified" size={16} className="text-on-secondary-container" />
            <span className="font-inter text-label-sm text-on-secondary-container uppercase tracking-wider">Verified Evidence Locker</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[900px] mx-auto px-container-margin-mobile py-8">
        {/* Hero */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar + info */}
            <div className="text-center md:text-left">
              <div className="w-24 h-24 rounded-full bg-surface-container mx-auto md:mx-0 flex items-center justify-center font-bold text-primary text-3xl mb-4">
                {profile.name?.split(" ").map((n) => n[0]).join("")}
              </div>
              <h1 className="font-hanken font-bold text-primary text-headline-lg">{profile.name}</h1>
              <p className="font-inter text-body-md text-on-surface-variant mt-0.5">{profile.city}</p>
              <div className="flex justify-center md:justify-start mt-2">
                <LevelBadge level={profile.level} />
              </div>
            </div>

            {/* Grit ring */}
            <div className="flex flex-col items-center gap-4 md:ml-auto">
              <GritMeter score={profile.grit_score} size={140} />
              <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-1.5">
                <span className="text-base">🔥</span>
                <span className="font-inter font-bold text-on-surface text-label-md">{profile.streak || 0} day streak</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-outline-variant">
            {[
              { label: "Proofs Completed",  value: profile.proof_points_completed || 0 },
              { label: "Grit Score",         value: Math.round(profile.grit_score) },
              { label: "Certifications",     value: profile.level >= 5 ? "Elite" : `Level ${profile.level}` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-hanken font-bold text-primary text-headline-md">{s.value}</p>
                <p className="font-inter text-label-sm text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grit breakdown */}
          <div className="card p-6">
            <h2 className="font-hanken font-semibold text-headline-md text-primary mb-4">
              Verified Skill Scores
            </h2>
            <div className="space-y-3">
              {dims.map((d) => <DimBar key={d.label} {...d} />)}
            </div>
          </div>

          {/* Evidence sessions */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant">
              <h2 className="font-hanken font-semibold text-headline-md text-on-surface">Practice Evidence</h2>
            </div>
            <div className="divide-y divide-outline-variant">
              {(profile.evidence || []).length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="font-inter text-body-md text-on-surface-variant">No evidence yet.</p>
                </div>
              ) : (profile.evidence || []).map((s) => (
                <div key={s.id} className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary-container rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="mic" size={16} className="text-on-secondary-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-semibold text-on-surface text-body-md">
                      {s.task_id?.replace("pp-", "PP ")}
                    </p>
                    {s.highlight && (
                      <p className="font-inter text-label-md text-on-surface-variant truncate">{s.highlight}</p>
                    )}
                  </div>
                  <span className="badge-teal shrink-0">{Math.round(s.grit_score)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recruiter CTA */}
        <div className="mt-6 bg-primary rounded-xl p-8 text-center">
          <h2 className="font-hanken font-bold text-on-primary text-headline-md mb-2">
            Want to hire {profile.name?.split(" ")[0]}?
          </h2>
          <p className="font-inter text-body-md text-primary-fixed-dim mb-6">
            Create a free company account to access their full Evidence Locker and request an interview.
          </p>
          <Link to="/register?role=company" className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-3 rounded-lg font-inter font-semibold text-body-md hover:opacity-90 transition-all">
            Get Started Free <Icon name="arrow_forward" />
          </Link>
        </div>
      </main>
    </div>
  );
}
