import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";

// ─── Scenarios ────────────────────────────────────────────────────────────────
const SCENARIOS = {
  "Job interview crack karna hai": [
    "HR: 'Tell me about a time you failed. What did you learn?' 45 seconds mein compelling answer do.",
    "Interviewer: 'Aap team mein conflict kaise handle karte hain?' Specific example ke saath batao.",
    "Hiring Manager: 'Apna sabse bada achievement batao.' 60 seconds — start karo strong, end karo stronger.",
  ],
  "Pehla client handle karna hai": [
    "Client pehli call pe skeptical hai: 'Tumhara track record kya hai?' — Confidently respond karo.",
    "Client: 'Koi references de sakte ho?' — Abhi references nahi hain. Smoothly handle karo.",
    "Client ready hai lekin price sun ke chup ho gaya. Silence ko opportunity mein convert karo.",
  ],
  "Log mujhe seriously lein": [
    "Team meeting mein tumhara idea dismiss ho gaya. Professionally push back karo.",
    "Senior colleague ne galat fact use kiya presentation mein. Respectfully aur firmly correct karo.",
    "Networking event pe 60 seconds mein apna intro itna strong karo ki woh apna card zaroor dein.",
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const FILLER_WORDS = ["um", "uh", "like", "basically", "so", "you know", "actually", "kind of", "sort of", "right"];

function countFillers(text) {
  const lower = (text || "").toLowerCase();
  return FILLER_WORDS.reduce((count, w) => {
    const m = lower.match(new RegExp(`\\b${w}\\b`, "g"));
    return count + (m ? m.length : 0);
  }, 0);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function BarFill({ value, baseline, delay }) {
  const [width, setWidth] = useState(0);
  const started = useRef(false);
  if (!started.current) {
    started.current = true;
    setTimeout(() => setWidth(value), delay);
  }
  const improved = value > baseline;
  const color = improved ? "#0EA5A0" : value >= 60 ? "#415e91" : "#ba1a1a";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="font-inter text-label-md text-on-surface capitalize">{/* label passed via parent */}</span>
      </div>
      <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ScoreBar({ label, value, baseline = 0, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const started = useRef(false);
  if (!started.current) {
    started.current = true;
    setTimeout(() => setWidth(value), delay);
  }
  const improved = value > baseline;
  const color = improved ? "#0EA5A0" : value >= 60 ? "#415e91" : "#ba1a1a";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="font-inter text-label-md text-on-surface capitalize">{label}</span>
        <div className="flex items-center gap-2">
          {baseline > 0 && (
            <span className={`text-label-sm font-bold ${improved ? "text-secondary" : "text-error"}`}>
              {improved ? `+${value - baseline}` : `${value - baseline}`}
            </span>
          )}
          <span className="font-hanken font-bold text-label-md" style={{ color }}>{value}</span>
        </div>
      </div>
      <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function PulsingMic({ onStop }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative">
        <div className="absolute -inset-8 rounded-full bg-error/15 animate-ping" style={{ animationDuration: "1.5s" }} />
        <div className="absolute -inset-4 rounded-full bg-error/25 animate-pulse" />
        <button
          onClick={onStop}
          className="relative w-28 h-28 bg-error rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform duration-200"
        >
          <Icon name="mic" fill size={48} className="text-white" />
        </button>
      </div>
      <p className="font-inter text-label-md text-error font-semibold animate-pulse">Recording...</p>
      <p className="font-inter text-label-sm text-on-surface-variant">Done hone par button tap karein</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MicroLearnPage() {
  const navigate = useNavigate();

  const onboarding = JSON.parse(localStorage.getItem("gy_onboarding") || "{}");
  const baseline   = JSON.parse(localStorage.getItem("gy_baseline")   || "{}");

  const { goal = "Job interview crack karna hai" } = onboarding;
  const { averageGritScore: baselineScore = 0, dimensions: baselineDims = {} } = baseline;

  const scenarios = SCENARIOS[goal] || SCENARIOS["Job interview crack karna hai"];

  const [round,         setRound]         = useState(0);
  const [phase,         setPhase]         = useState("scenario"); // scenario|recording|analyzing|result|complete
  const [transcript,    setTranscript]    = useState("");
  const [interimText,   setInterimText]   = useState("");
  const [currentResult, setCurrentResult] = useState(null);

  const recognitionRef  = useRef(null);
  const finalTransRef   = useRef("");
  const allResultsRef   = useRef([]);
  const allTranscripts  = useRef([]);

  const startRecording = useCallback(() => {
    finalTransRef.current = "";
    setTranscript("");
    setInterimText("");

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-IN";
      rec.onresult = (e) => {
        let fin = "", interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) fin += t + " ";
          else interim += t;
        }
        if (fin) { finalTransRef.current += fin; setTranscript(finalTransRef.current); }
        setInterimText(interim);
      };
      rec.onerror = () => {};
      rec.start();
      recognitionRef.current = rec;
    }
    setPhase("recording");
  }, []);

  const stopAndAnalyze = useCallback(async () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setInterimText("");
    setPhase("analyzing");

    const text = finalTransRef.current.trim();
    allTranscripts.current = [...allTranscripts.current, text];

    try {
      const resp = await fetch(`${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}/evaluate/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, round: round + 1, goal, scenario: scenarios[round] }),
      });
      if (!resp.ok) throw new Error("API error");
      const result = await resp.json();
      allResultsRef.current = [...allResultsRef.current, result];
      setCurrentResult(result);
    } catch {
      const base = Math.max(baselineScore - 5, 45);
      const fallback = {
        gritScore: base, clarity: base, confidence: base - 3,
        persuasion: base - 2, structure: base + 4, relevance: base + 2,
        highlight: "Aapne try kiya — that matters!",
        fix: "Structure pe focus karo: point → reason → example.",
        encouragement: "Har session mein improvement hoti hai. Keep going!",
      };
      allResultsRef.current = [...allResultsRef.current, fallback];
      setCurrentResult(fallback);
    }
    setPhase("result");
  }, [round, goal, scenarios, baselineScore]);

  const goNext = useCallback(async () => {
    if (round < 2) {
      setRound((r) => r + 1);
      setPhase("scenario");
      setTranscript("");
      setCurrentResult(null);
      finalTransRef.current = "";
    } else {
      const all = allResultsRef.current;
      const dims = ["clarity", "confidence", "persuasion", "structure", "relevance"];
      const avgDims = {};
      for (const d of dims) {
        avgDims[d] = Math.round(all.reduce((a, r) => a + (r[d] || 0), 0) / all.length);
      }
      const overallGrit = Math.round(all.reduce((a, r) => a + (r.gritScore || 0), 0) / all.length);
      const fillerCount = countFillers(allTranscripts.current.join(" "));

      setPhase("complete");

      fetch(`${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}/microlearn/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: `anon_${Date.now()}`,
          goal, weekNumber: 1,
          rounds: all.map((r, i) => ({
            roundNumber: i + 1,
            scenario: scenarios[i],
            gritScore: r.gritScore,
            dimensions: { clarity: r.clarity, confidence: r.confidence, persuasion: r.persuasion, structure: r.structure, relevance: r.relevance },
            highlight: r.highlight,
            fix: r.fix,
          })),
          overallGritScore: overallGrit,
          baselineScore,
          improvement: overallGrit - baselineScore,
          fillerWordCount: fillerCount,
        }),
      }).catch(() => {});
    }
  }, [round, goal, scenarios, baselineScore]);

  const all         = allResultsRef.current;
  const overallGrit = all.length === 3 ? Math.round(all.reduce((a, r) => a + r.gritScore, 0) / 3) : 0;
  const improvement = overallGrit - baselineScore;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <div className="bg-primary px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-on-secondary text-sm font-bold">Y</span>
          </div>
          <span className="text-on-primary font-hanken font-semibold text-body-md">MicroLearn</span>
        </div>
        {phase !== "complete" && (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i < round ? "bg-secondary w-6" : i === round ? "bg-secondary w-6 animate-pulse" : "bg-on-primary/20 w-4"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <main className="flex-1 px-5 py-6 max-w-lg mx-auto w-full pb-10">
        {phase !== "complete" && (
          <p className="text-label-sm font-inter text-on-surface-variant uppercase tracking-wider mb-4">
            Round {round + 1} of 3
          </p>
        )}

        {/* ── Scenario ── */}
        {phase === "scenario" && (
          <div className="space-y-5 animate-slide-up">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-on-primary text-xs font-bold">Y</span>
                </div>
                <span className="font-inter font-semibold text-primary text-label-md">Yari ka scenario:</span>
              </div>
              <p className="font-inter text-body-md text-on-surface leading-relaxed">{scenarios[round]}</p>
            </div>

            {baselineScore > 0 && (
              <div className="bg-surface-container border border-outline-variant rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="text-xl">🎯</span>
                <p className="font-inter text-label-md text-on-surface-variant">
                  Baseline: <span className="font-bold text-primary">{baselineScore}</span> — beat it today!
                </p>
              </div>
            )}

            <button
              onClick={startRecording}
              className="w-full bg-secondary text-on-secondary font-hanken font-bold text-body-md py-4 rounded-xl transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2"
            >
              <Icon name="mic" fill size={22} className="text-on-secondary" />
              Record Karo
            </button>
          </div>
        )}

        {/* ── Recording ── */}
        {phase === "recording" && (
          <div className="space-y-5 animate-slide-up">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
              <p className="font-inter text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">SCENARIO</p>
              <p className="font-inter text-label-md text-on-surface leading-relaxed">{scenarios[round]}</p>
            </div>

            <PulsingMic onStop={stopAndAnalyze} />

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 min-h-[90px]">
              <p className="font-inter text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Live Transcript</p>
              <p className="font-inter text-body-md text-on-surface leading-relaxed">
                {transcript}
                <span className="text-on-surface-variant italic">{interimText}</span>
                {!transcript && !interimText && (
                  <span className="text-on-surface-variant">Bolna shuru karein...</span>
                )}
              </p>
            </div>

            <button
              onClick={stopAndAnalyze}
              className="w-full border-2 border-secondary text-secondary font-hanken font-bold text-body-md py-4 rounded-xl transition-all active:scale-95 hover:bg-secondary/5"
            >
              Done — Score Dikhao
            </button>
          </div>
        )}

        {/* ── Analyzing ── */}
        {phase === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 animate-slide-up">
            <div className="w-14 h-14 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-hanken font-bold text-primary text-headline-md mb-1">Analyzing...</p>
              <p className="font-inter text-body-md text-on-surface-variant">Score aa raha hai</p>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {phase === "result" && currentResult && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="font-hanken font-bold text-primary text-headline-md">Round {round + 1} Score</h2>

            <div className="bg-primary rounded-2xl p-6 text-center">
              <p className="font-inter text-on-primary/60 text-label-sm uppercase tracking-widest mb-1">Grit Score</p>
              <p className="font-hanken font-black text-on-primary" style={{ fontSize: 72, lineHeight: 1 }}>
                {currentResult.gritScore}
              </p>
              {baselineScore > 0 && (
                <p className={`font-inter text-label-md mt-2 font-semibold ${
                  currentResult.gritScore > baselineScore ? "text-secondary" : "text-on-primary/50"
                }`}>
                  {currentResult.gritScore > baselineScore
                    ? `+${currentResult.gritScore - baselineScore} vs baseline 🔥`
                    : `Baseline: ${baselineScore}`}
                </p>
              )}
            </div>

            <div className="card p-5 space-y-4">
              {["clarity", "confidence", "persuasion", "structure", "relevance"].map((d, i) => (
                <ScoreBar
                  key={d}
                  label={d.charAt(0).toUpperCase() + d.slice(1)}
                  value={currentResult[d] || 0}
                  baseline={baselineDims[d] || 0}
                  delay={i * 150}
                />
              ))}
            </div>

            {currentResult.highlight && (
              <div className="flex gap-3 bg-secondary/5 border border-secondary/20 rounded-xl p-4">
                <span className="text-xl shrink-0">⭐</span>
                <p className="font-inter text-body-md text-on-surface-variant">{currentResult.highlight}</p>
              </div>
            )}
            {currentResult.encouragement && (
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 items-start">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-on-primary text-[10px] font-bold">Y</span>
                </div>
                <p className="font-inter text-body-md text-on-surface-variant leading-relaxed">{currentResult.encouragement}</p>
              </div>
            )}

            <button
              onClick={goNext}
              className="w-full bg-secondary text-on-secondary font-hanken font-bold text-body-md py-4 rounded-xl transition-all active:scale-95 hover:opacity-90"
            >
              {round < 2 ? `Round ${round + 2} →` : "Session Complete →"}
            </button>
          </div>
        )}

        {/* ── Complete ── */}
        {phase === "complete" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center pt-4">
              <div className="text-6xl mb-3">🏆</div>
              <h2 className="font-hanken font-black text-primary text-headline-lg-mobile">Session Complete!</h2>
              <p className="font-inter text-body-md text-on-surface-variant mt-1">
                Tumne 3 rounds ki practice ki — yeh real growth hai.
              </p>
            </div>

            <div className="card p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-hanken font-black text-primary text-headline-md">{overallGrit}</p>
                  <p className="font-inter text-label-sm text-on-surface-variant">Session Score</p>
                </div>
                <div>
                  <p className={`font-hanken font-black text-headline-md ${improvement >= 0 ? "text-secondary" : "text-error"}`}>
                    {improvement >= 0 ? "+" : ""}{improvement}
                  </p>
                  <p className="font-inter text-label-sm text-on-surface-variant">vs Baseline</p>
                </div>
                <div>
                  <p className="font-hanken font-black text-primary text-headline-md">3</p>
                  <p className="font-inter text-label-sm text-on-surface-variant">Rounds Done</p>
                </div>
              </div>
            </div>

            {improvement > 0 && (
              <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 text-center">
                <p className="font-hanken font-semibold text-secondary text-body-md">
                  🔥 Tumne apna baseline beat kar diya! {improvement} points ki improvement!
                </p>
              </div>
            )}

            {improvement <= 0 && (
              <div className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center">
                <p className="font-inter text-body-md text-on-surface-variant">
                  Practice se hi mastery aati hai. Kal phir practice karo — improvement zaroor aayegi! 💪
                </p>
              </div>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-secondary text-on-secondary font-hanken font-bold text-body-md py-5 rounded-xl transition-all active:scale-95 hover:opacity-90"
            >
              Dashboard par Jaayein →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
