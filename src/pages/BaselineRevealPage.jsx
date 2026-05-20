import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CountUp({ target, duration = 1800 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const steps = 60;
    const inc = target / steps;
    let n = 0;
    const id = setInterval(() => {
      n++;
      if (n >= steps) { setVal(target); clearInterval(id); }
      else setVal(Math.round(inc * n));
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);
  return <span>{val}</span>;
}

function BarFill({ value, delay, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 400);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div
      className="h-full rounded-full transition-all duration-1000 ease-out"
      style={{ width: `${width}%`, backgroundColor: color }}
    />
  );
}

const ROADMAPS = {
  "Job interview crack karna hai": [
    "Week 1–2: Cold Opener Mastery — pehle 10 seconds pe focus",
    "Week 3–4: Objection Handling — 5 common objections crack karna",
    "Week 5–6: Closing Techniques — assumptive close + follow-up",
    "Week 7–8: Mock Interviews — full 30-min simulation",
  ],
  "Pehla client handle karna hai": [
    "Week 1–2: Discovery Questions — right questions se needs nikalna",
    "Week 3–4: Value Proposition — ROI language mein baat karna",
    "Week 5–6: Proposal Pitching — clear, confident proposal",
    "Week 7–8: Closing & Follow-up — deal close karna gracefully",
  ],
  "Log mujhe seriously lein": [
    "Week 1–2: Speaking with Authority — voice, pace, confidence",
    "Week 3–4: Structured Arguments — point-reason-example format",
    "Week 5–6: Handling Pushback — respectfully counter challenges",
    "Week 7–8: Presence & Impact — commanding any room",
  ],
};

const DIMS = [
  { key: "clarity",    label: "Clarity"    },
  { key: "confidence", label: "Confidence" },
  { key: "persuasion", label: "Persuasion" },
  { key: "structure",  label: "Structure"  },
  { key: "relevance",  label: "Relevance"  },
];

export default function BaselineRevealPage() {
  const navigate = useNavigate();
  const [showScore,   setShowScore]   = useState(false);
  const [showDims,    setShowDims]    = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const baseline   = JSON.parse(localStorage.getItem("gy_baseline")   || "{}");
  const onboarding = JSON.parse(localStorage.getItem("gy_onboarding") || "{}");

  const { goal = "Job interview crack karna hai", name = "Friend" } = onboarding;
  const {
    averageGritScore = 0,
    dimensions = {},
    round1Score = 0,
    round2Score = 0,
    round3Score = 0,
  } = baseline;

  const sorted    = [...DIMS].sort((a, b) => (dimensions[b.key] || 0) - (dimensions[a.key] || 0));
  const strongest = sorted[0].key;
  const weakest   = sorted[sorted.length - 1].key;
  const roadmap   = ROADMAPS[goal] || ROADMAPS["Job interview crack karna hai"];

  useEffect(() => {
    const t1 = setTimeout(() => setShowScore(true),   800);
    const t2 = setTimeout(() => setShowDims(true),    2700);
    const t3 = setTimeout(() => setShowRoadmap(true), 4900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="min-h-screen bg-surface pb-12">
      {/* Hero */}
      <div className="bg-primary px-5 pt-8 pb-6 text-center">
        <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,106,102,0.5)]">
          <span className="text-on-secondary font-hanken font-black text-xl">Y</span>
        </div>
        <h1 className="font-hanken font-black text-on-primary text-headline-lg-mobile">
          {name}, yeh raha tumhara Baseline!
        </h1>
        <p className="font-inter text-on-primary/60 text-label-md mt-1.5">
          Teen rounds of real evaluation — koi shortcuts nahi
        </p>
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-5">

        {/* Grit Score */}
        {showScore && (
          <div className="card p-6 text-center animate-slide-up">
            <p className="font-inter text-on-surface-variant text-label-sm uppercase tracking-widest mb-3">
              Your Baseline Grit Score™
            </p>
            <div className="font-hanken font-black text-primary" style={{ fontSize: 96, lineHeight: 1 }}>
              <CountUp target={averageGritScore} />
            </div>
            <p className="font-inter text-label-md text-on-surface-variant mt-1 mb-5">/100</p>
            <div className="pt-4 border-t border-outline-variant grid grid-cols-3 gap-3">
              {[
                { label: "Round 1", value: round1Score },
                { label: "Round 2", value: round2Score },
                { label: "Round 3", value: round3Score },
              ].map((r) => (
                <div key={r.label} className="text-center">
                  <p className="font-hanken font-bold text-primary text-headline-md">{r.value}</p>
                  <p className="font-inter text-label-sm text-on-surface-variant">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Breakdown */}
        {showDims && (
          <div className="card p-5 space-y-5 animate-slide-up">
            <h3 className="font-hanken font-semibold text-primary text-headline-md">Skill Breakdown</h3>
            {DIMS.map((d, i) => {
              const val        = dimensions[d.key] || 0;
              const isStrongest = d.key === strongest;
              const isWeakest   = d.key === weakest;
              const color = isStrongest ? "#0EA5A0" : isWeakest ? "#ba1a1a" : "#415e91";
              return (
                <div key={d.key}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-inter font-medium text-label-md text-on-surface flex-1">{d.label}</span>
                    {isStrongest && (
                      <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-semibold">
                        ⭐ Strongest
                      </span>
                    )}
                    {isWeakest && (
                      <span className="text-xs bg-error/10 text-error border border-error/20 px-2 py-0.5 rounded-full font-semibold">
                        Focus here
                      </span>
                    )}
                    <span className="font-hanken font-bold text-label-md" style={{ color }}>{val}</span>
                  </div>
                  <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                    <BarFill value={val} delay={i * 200} color={color} />
                  </div>
                  {isWeakest && baseline.fixes?.[0] && (
                    <p className="font-inter text-label-sm text-on-surface-variant mt-1.5 italic">
                      💡 {baseline.fixes[0]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 8-Week Roadmap */}
        {showRoadmap && (
          <div className="card p-5 animate-slide-up">
            <h3 className="font-hanken font-semibold text-primary text-headline-md mb-1">Aapka 8-Week Roadmap</h3>
            <p className="font-inter text-label-md text-on-surface-variant mb-5">Goal: {goal}</p>
            <div className="space-y-4">
              {roadmap.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                    i === 0 ? "bg-secondary text-on-secondary" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    {i + 1}
                  </div>
                  <p className={`font-inter text-body-md leading-relaxed ${
                    i === 0 ? "text-on-surface font-medium" : "text-on-surface-variant"
                  }`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {showRoadmap && (
          <button
            onClick={() => navigate("/microlearn")}
            className="w-full bg-secondary text-on-secondary font-hanken font-bold text-body-md py-5 rounded-xl transition-all active:scale-95 hover:opacity-90 animate-slide-up shadow-lg"
          >
            Pehla Session Shuru Karein →
          </button>
        )}
      </div>
    </div>
  );
}
