import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function TypewriterText({ text, speed = 28, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idxRef.current = 0;
    timerRef.current = setInterval(() => {
      if (idxRef.current < text.length) {
        setDisplayed(text.slice(0, idxRef.current + 1));
        idxRef.current++;
      } else {
        clearInterval(timerRef.current);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="opacity-60 animate-pulse">▋</span>}
    </span>
  );
}

const GOALS = [
  { emoji: "🎯", label: "Job interview crack karna hai" },
  { emoji: "💼", label: "Pehla client handle karna hai" },
  { emoji: "🗣️", label: "Log mujhe seriously lein" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [showGoals, setShowGoals] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [confirmDone, setConfirmDone] = useState(false);

  const handleGoalSelect = (g) => {
    if (selectedGoal) return;
    setSelectedGoal(g.label);
    setGoal(g.label);
    setTimeout(() => setStep(2), 500);
  };

  const submitName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setName(trimmed);
    setStep(3);
  };

  const submitCity = () => {
    const trimmed = cityInput.trim();
    if (!trimmed) return;
    localStorage.setItem("gy_onboarding", JSON.stringify({ goal, name: nameInput.trim(), city: trimmed }));
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-6 py-12">
      {/* Yari avatar */}
      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,106,102,0.5)]">
        <span className="text-on-secondary font-hanken font-black text-2xl">Y</span>
      </div>

      <div className="w-full max-w-sm">
        {/* Step 0 — Intro */}
        {step === 0 && (
          <div className="text-center animate-slide-up">
            <p className="font-hanken text-on-primary text-body-lg leading-relaxed">
              <TypewriterText
                text="Namaste! Main hoon Yari — aapka personal communication coach. Main aapko ready karne aaya hoon — us interview ke liye, us moment ke liye jab sab kuch aap par depend karta hai."
                speed={22}
                onDone={() => setTimeout(() => setStep(1), 600)}
              />
            </p>
          </div>
        )}

        {/* Step 1 — Goal selection */}
        {step === 1 && (
          <div className="animate-slide-up">
            <p className="font-hanken text-on-primary text-body-lg text-center mb-8">
              <TypewriterText
                text="Pehle batayein — aap abhi kya dhundh rahe hain?"
                speed={32}
                onDone={() => setShowGoals(true)}
              />
            </p>
            {showGoals && (
              <div className="space-y-3">
                {GOALS.map((g) => (
                  <button
                    key={g.label}
                    onClick={() => handleGoalSelect(g)}
                    className={`w-full border rounded-xl py-4 px-5 text-left flex items-center gap-3 transition-all duration-200 active:scale-95 font-inter font-semibold text-body-md ${
                      selectedGoal === g.label
                        ? "bg-secondary border-secondary text-on-secondary"
                        : "bg-white/5 border-white/20 text-on-primary hover:bg-white/10 hover:border-secondary/60"
                    }`}
                  >
                    <span className="text-2xl shrink-0">{g.emoji}</span>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Name */}
        {step === 2 && (
          <div className="animate-slide-up">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-on-secondary text-[10px] font-bold">Y</span>
                </div>
                <span className="text-on-primary/50 text-label-sm font-inter uppercase tracking-wider">Yari</span>
              </div>
              <p className="font-hanken text-on-primary text-body-lg">
                <TypewriterText text="Acha! Aur aapka naam kya hai?" speed={32} />
              </p>
            </div>
            <div className="flex gap-3">
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitName()}
                placeholder="Apna naam likhein..."
                className="flex-1 bg-white/10 border border-white/20 text-on-primary placeholder-on-primary/30 font-inter text-body-md py-3 px-4 rounded-xl focus:outline-none focus:border-secondary transition-colors"
              />
              <button
                onClick={submitName}
                disabled={!nameInput.trim()}
                className="bg-secondary text-on-secondary font-bold px-5 rounded-xl disabled:opacity-30 transition-all active:scale-95 text-xl"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — City */}
        {step === 3 && (
          <div className="animate-slide-up">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-on-secondary text-[10px] font-bold">Y</span>
                </div>
                <span className="text-on-primary/50 text-label-sm font-inter uppercase tracking-wider">Yari</span>
              </div>
              <p className="font-hanken text-on-primary text-body-lg">
                <TypewriterText text={`Nice to meet you, ${name}! Aap kaunse city mein hain?`} speed={32} />
              </p>
            </div>
            <div className="flex gap-3">
              <input
                autoFocus
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitCity()}
                placeholder="Apna city likhein..."
                className="flex-1 bg-white/10 border border-white/20 text-on-primary placeholder-on-primary/30 font-inter text-body-md py-3 px-4 rounded-xl focus:outline-none focus:border-secondary transition-colors"
              />
              <button
                onClick={submitCity}
                disabled={!cityInput.trim()}
                className="bg-secondary text-on-secondary font-bold px-5 rounded-xl disabled:opacity-30 transition-all active:scale-95 text-xl"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Warm confirmation */}
        {step === 4 && (
          <div className="text-center animate-slide-up">
            <div className="text-5xl mb-5">🎉</div>
            <p className="font-hanken text-on-primary text-body-lg leading-relaxed">
              <TypewriterText
                text={`Wah ${name}! ${cityInput.trim()} se ho — great! Ab main tumhara baseline score nikalta hoon. Teen rounds mein hum dekhenge tumhari actual communication power. Ready ho?`}
                speed={22}
                onDone={() => setConfirmDone(true)}
              />
            </p>
            {confirmDone && (
              <button
                onClick={() => navigate("/evaluation")}
                className="mt-8 w-full bg-secondary text-on-secondary font-hanken font-bold text-body-md py-4 rounded-xl transition-all active:scale-95 hover:opacity-90 animate-slide-up"
              >
                Haan, Ready Hoon! →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
