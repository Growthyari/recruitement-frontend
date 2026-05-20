import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";

// ─── Scenario bank ────────────────────────────────────────────────────────────
const SCENARIOS = {
  "Job interview crack karna hai": [
    {
      title: "Round 1: Customer Conversation",
      yariSays: "Aap ek mobile shop ke salesperson ho. Ek customer sirf dekhne aaya hai — use interested banana hai. Naturally start karo conversation.",
      scenario: "Aap ek mobile shop mein salesperson hain. Ek customer andar aaya — woh sirf dekhne aaya hai. Unse conversation naturally start karein.",
    },
    {
      title: "Round 2: Handle the Objection",
      yariSays: "Wohi customer bol raha hai: 'Nahi chahiye abhi.' Objection handle karo aur conversation alive rakho.",
      scenario: "Customer bolta hai: 'Nahi chahiye abhi.' Is objection ko handle karo aur conversation alive rakho.",
    },
    {
      title: "Round 3: The Real Interview",
      yariSays: "Interview room. HR ne poochha — Tell me about yourself. 60 seconds ka moka hai. Best answer do.",
      scenario: "Interview Room. HR ne poochha: 'Tell me about yourself aur why should we hire you?' 60 seconds mein apna best answer dein.",
    },
  ],
  "Pehla client handle karna hai": [
    {
      title: "Round 1: Approach a Prospect",
      yariSays: "Tumhara dost chhota business chalata hai. Use digital marketing ki zaroorat hai par wo socha nahi abhi tak. Approach karo naturally.",
      scenario: "Aapka ek dost chhota business chalata hai. Usse digital marketing ki zaroorat hai lekin usne socha nahi abhi tak. Usse approach karein.",
    },
    {
      title: "Round 2: Handle the Delay",
      yariSays: "Dost bola: 'Baad mein dekhte hain.' Is delay ko break karo — abhi hi decide karwao.",
      scenario: "Dost bol raha hai: 'Baad mein dekhte hain, abhi nahi.' Usse convince karein ki yeh sahi time hai.",
    },
    {
      title: "Round 3: Full Client Pitch",
      yariSays: "Client call. Client bol raha hai — 'Bata, aapka kya plan hai?' 60 seconds mein apna sabse powerful pitch do.",
      scenario: "Client call. Client: 'Theek hai, bata aapka kya plan hai mere business ke liye?' 60 seconds mein apna best pitch dein.",
    },
  ],
  "Log mujhe seriously lein": [
    {
      title: "Round 1: Group Discussion",
      yariSays: "Group discussion chal raha hai — social media ka youth par asar. 30 seconds mein itni strong opening do ki sab ruk jaayein.",
      scenario: "College mein aap group discussion mein hain. Topic hai: social media ka youth par asar. Apni baat shuru karein — 30 seconds mein strong opening dein.",
    },
    {
      title: "Round 2: Counter the Challenge",
      yariSays: "Group member bola: 'Sab bolte hain yahi.' Prove karo ki tumhara point unique aur solid hai.",
      scenario: "Group member bola: 'Sab bolte hain yahi.' Apni baat aur strong karein aur prove karein ki aapka point unique hai.",
    },
    {
      title: "Round 3: Make Them Listen",
      yariSays: "60 seconds. Ek solution present karna hai jo sab ko impress kare. Is baar ruk jaayenge sab — go!",
      scenario: "Group presentation. 60 seconds mein ek solution present karein jo sab ko impress kare. Start!",
    },
  ],
};

// ─── Animated bar ─────────────────────────────────────────────────────────────
function AnimatedBar({ label, value, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const mounted = useRef(false);
  if (!mounted.current) {
    mounted.current = true;
    setTimeout(() => setWidth(value), delay);
  }
  const color = value >= 70 ? "#0EA5A0" : value >= 50 ? "#415e91" : "#ba1a1a";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="font-inter text-label-md text-on-surface capitalize">{label}</span>
        <span className="font-hanken font-bold text-label-md" style={{ color }}>{value}</span>
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

// ─── Pulsing mic button ───────────────────────────────────────────────────────
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
export default function EvaluationPage() {
  const navigate = useNavigate();
  const onboarding = JSON.parse(localStorage.getItem("gy_onboarding") || "{}");
  const { goal = "Job interview crack karna hai" } = onboarding;
  const scenariosForGoal = SCENARIOS[goal] || SCENARIOS["Job interview crack karna hai"];

  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState("scenario"); // scenario | recording | analyzing | result
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [currentResult, setCurrentResult] = useState(null);

  const recognitionRef = useRef(null);
  const finalTransRef  = useRef("");
  const roundResultsRef = useRef([]);

  const startRecording = useCallback(() => {
    finalTransRef.current = "";
    setTranscript("");
    setInterimText("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
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
    const currentScenario = scenariosForGoal[round];

    try {
      const resp = await fetch(`${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}/evaluate/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, round: round + 1, goal, scenario: currentScenario.scenario }),
      });
      if (!resp.ok) throw new Error("API error");
      const result = await resp.json();
      roundResultsRef.current = [...roundResultsRef.current, result];
      setCurrentResult(result);
    } catch {
      const fallback = {
        gritScore: 52, clarity: 52, confidence: 48, persuasion: 50, structure: 55, relevance: 55,
        highlight: "Aapne try kiya — yahi most important hai!",
        fix: "Structure thoda better karo: point → reason → example.",
        encouragement: "Har attempt se aap better ho rahe ho. Keep going!",
      };
      roundResultsRef.current = [...roundResultsRef.current, fallback];
      setCurrentResult(fallback);
    }
    setPhase("result");
  }, [round, goal, scenariosForGoal]);

  const goNext = useCallback(() => {
    if (round < 2) {
      setRound((r) => r + 1);
      setPhase("scenario");
      setTranscript("");
      setCurrentResult(null);
      finalTransRef.current = "";
    } else {
      // All 3 rounds done — compute averages and navigate
      const all = roundResultsRef.current;
      const dims = ["clarity", "confidence", "persuasion", "structure", "relevance"];
      const avgDims = {};
      for (const d of dims) {
        avgDims[d] = Math.round(all.reduce((a, r) => a + (r[d] || 0), 0) / all.length);
      }
      const avgGrit = Math.round(all.reduce((a, r) => a + (r.gritScore || 0), 0) / all.length);

      localStorage.setItem("gy_baseline", JSON.stringify({
        round1Score: all[0]?.gritScore || 0,
        round2Score: all[1]?.gritScore || 0,
        round3Score: all[2]?.gritScore || 0,
        averageGritScore: avgGrit,
        dimensions: avgDims,
        highlights: all.map((r) => r.highlight),
        fixes: all.map((r) => r.fix),
      }));

      const { city } = onboarding;
      fetch(`${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}/users/baseline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: `anon_${Date.now()}`,
          goal, city, averageGritScore: avgGrit, dimensions: avgDims,
          round1Score: all[0]?.gritScore || 0,
          round2Score: all[1]?.gritScore || 0,
          round3Score: all[2]?.gritScore || 0,
        }),
      }).catch(() => {});

      navigate("/baseline");
    }
  }, [round, goal, onboarding, navigate]);

  const current = scenariosForGoal[round];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <div className="bg-primary px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-on-secondary text-sm font-bold">Y</span>
          </div>
          <span className="text-on-primary font-hanken font-semibold text-body-md">Yari Evaluation</span>
        </div>
        <div className="flex gap-2 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i < round
                  ? "bg-secondary w-6"
                  : i === round
                  ? "bg-secondary w-6 animate-pulse"
                  : "bg-on-primary/20 w-4"
              }`}
            />
          ))}
        </div>
      </div>

      <main className="flex-1 px-5 py-6 max-w-lg mx-auto w-full pb-10">
        <p className="text-label-sm font-inter text-on-surface-variant uppercase tracking-wider mb-4">
          Round {round + 1} of 3
        </p>

        {/* ── Scenario phase ── */}
        {phase === "scenario" && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="font-hanken font-bold text-primary text-headline-md">{current.title}</h2>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-on-primary text-xs font-bold">Y</span>
                </div>
                <span className="font-inter font-semibold text-primary text-label-md">Yari says:</span>
              </div>
              <p className="font-inter text-body-md text-on-surface-variant leading-relaxed">"{current.yariSays}"</p>
            </div>

            <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
              <p className="font-inter text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">SCENARIO</p>
              <p className="font-inter text-body-md text-on-surface leading-relaxed">{current.scenario}</p>
            </div>

            <button
              onClick={startRecording}
              className="w-full bg-secondary text-on-secondary font-hanken font-bold text-body-md py-4 rounded-xl transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2"
            >
              <Icon name="mic" fill size={22} className="text-on-secondary" />
              Record Karna Shuru Karein
            </button>
          </div>
        )}

        {/* ── Recording phase ── */}
        {phase === "recording" && (
          <div className="space-y-5 animate-slide-up">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
              <p className="font-inter text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">SCENARIO</p>
              <p className="font-inter text-label-md text-on-surface leading-relaxed">{current.scenario}</p>
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

        {/* ── Analyzing phase ── */}
        {phase === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 animate-slide-up">
            <div className="w-14 h-14 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-hanken font-bold text-primary text-headline-md mb-1">Yari analyzing...</p>
              <p className="font-inter text-body-md text-on-surface-variant">Main tumhara response score kar raha hoon</p>
            </div>
          </div>
        )}

        {/* ── Result phase ── */}
        {phase === "result" && currentResult && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="font-hanken font-bold text-primary text-headline-md">Round {round + 1} Result</h2>

            <div className="bg-primary rounded-2xl p-6 text-center">
              <p className="font-inter text-on-primary/60 text-label-sm uppercase tracking-widest mb-1">Grit Score</p>
              <p className="font-hanken font-black text-on-primary" style={{ fontSize: 72, lineHeight: 1 }}>
                {currentResult.gritScore}
              </p>
              <p className="font-inter text-on-primary/50 text-label-md mt-1">/100</p>
            </div>

            <div className="card p-5 space-y-4">
              {["clarity", "confidence", "persuasion", "structure", "relevance"].map((d, i) => (
                <AnimatedBar key={d} label={d.charAt(0).toUpperCase() + d.slice(1)} value={currentResult[d] || 0} delay={i * 150} />
              ))}
            </div>

            <div className="space-y-3">
              {currentResult.highlight && (
                <div className="flex gap-3 bg-secondary/5 border border-secondary/20 rounded-xl p-4">
                  <span className="text-xl shrink-0">⭐</span>
                  <div>
                    <p className="font-inter font-semibold text-on-surface text-label-md mb-0.5">Kya acha kiya</p>
                    <p className="font-inter text-body-md text-on-surface-variant">{currentResult.highlight}</p>
                  </div>
                </div>
              )}
              {currentResult.fix && (
                <div className="flex gap-3 bg-surface-container rounded-xl p-4">
                  <span className="text-xl shrink-0">💡</span>
                  <div>
                    <p className="font-inter font-semibold text-on-surface text-label-md mb-0.5">Improve karo yeh</p>
                    <p className="font-inter text-body-md text-on-surface-variant">{currentResult.fix}</p>
                  </div>
                </div>
              )}
              {currentResult.encouragement && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 items-start">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <span className="text-on-primary text-xs font-bold">Y</span>
                  </div>
                  <p className="font-inter text-body-md text-on-surface-variant leading-relaxed">{currentResult.encouragement}</p>
                </div>
              )}
            </div>

            <button
              onClick={goNext}
              className="w-full bg-secondary text-on-secondary font-hanken font-bold text-body-md py-4 rounded-xl transition-all active:scale-95 hover:opacity-90"
            >
              {round < 2 ? `Round ${round + 2} Shuru Karein →` : "Apna Baseline Score Dekhein →"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
