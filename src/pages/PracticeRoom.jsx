import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTask, getHint, submitSession } from "../services/api";
import Navbar from "../components/Navbar";
import DimBar from "../components/DimBar";
import Icon from "../components/Icon";

const WAVE_HEIGHTS = [12, 8, 16, 24, 14, 20, 10, 18, 22, 12, 16, 8, 20, 14, 10, 24, 12, 18, 22, 14];
const TIMER_SECONDS = 40 * 60;

function Waveform({ active }) {
  return (
    <div className="flex items-end justify-center h-24 w-full opacity-60">
      {WAVE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={`waveform-bar ${active ? "active" : ""}`}
          style={{
            height: `${h * (active ? 1 : 0.5)}px`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

function FeedbackOverlay({ result, onContinue }) {
  if (!result) return null;
  const dims = ["clarity", "persuasion", "structure", "confidence", "relevance"];
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-modal animate-slide-up">
        {/* Header */}
        <div className="bg-secondary-container/30 border-b border-outline-variant px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="check" className="text-on-secondary" />
            </div>
            <div>
              <p className="font-inter text-label-md text-on-surface-variant">Session Complete</p>
              <p className="font-hanken font-bold text-primary text-headline-md">
                Grit Score: <span className="text-secondary">{Math.round(result.grit_score)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="p-6 space-y-3">
          {dims.map((d) => (
            <DimBar key={d} label={d.charAt(0).toUpperCase() + d.slice(1)} value={result.scores?.[d] || 0} />
          ))}
        </div>

        {/* Coach notes */}
        <div className="px-6 pb-2 space-y-4">
          {result.highlight && (
            <div className="flex gap-3 bg-secondary-container/20 border border-secondary/20 rounded-xl p-4">
              <Icon name="star" fill className="text-secondary shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-inter font-semibold text-on-surface text-label-md mb-0.5">What you did well</p>
                <p className="font-inter text-body-md text-on-surface-variant">{result.highlight}</p>
              </div>
            </div>
          )}
          {result.improvement && (
            <div className="flex gap-3 bg-surface-container rounded-xl p-4">
              <Icon name="lightbulb" fill className="text-secondary shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-inter font-semibold text-on-surface text-label-md mb-0.5">One thing to improve</p>
                <p className="font-inter text-body-md text-on-surface-variant">{result.improvement}</p>
              </div>
            </div>
          )}
          {result.coach_note && (
            <div className="flex gap-3 bg-primary/5 border border-primary/10 rounded-xl p-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                <span className="text-on-primary text-xs font-bold">Y</span>
              </div>
              <div>
                <p className="font-inter font-semibold text-primary text-label-md mb-0.5">Yari says</p>
                <p className="font-inter text-body-md text-on-surface-variant">{result.coach_note}</p>
              </div>
            </div>
          )}
          {result.level_unlocked && (
            <div className="flex gap-3 bg-secondary text-on-secondary rounded-xl p-4">
              <Icon name="verified_user" fill size={24} className="shrink-0" />
              <p className="font-inter font-bold text-body-md">
                🎉 Level {result.level} Unlocked! You've earned your verified badge.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 pt-4">
          <button onClick={onContinue} className="btn-primary w-full py-4 text-body-md">
            Continue <Icon name="arrow_forward" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PracticeRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [pp, setPp]               = useState(null);
  const [hint, setHint]           = useState(null);
  const [showHint, setShowHint]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [timer, setTimer]         = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [result, setResult]           = useState(null);
  const [tab, setTab]                 = useState("record"); // "record" | "type"

  const mediaRef  = useRef(null);
  const chunksRef = useRef([]);
  const timerRef  = useRef(null);

  useEffect(() => {
    getTask(id).then(setPp);
    getHint(id).then(setHint);
  }, [id]);

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (timer === 0) stopRecording();
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timer]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" }));
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      setTimerActive(true);
    } catch {
      alert("Microphone access denied. Please allow microphone access and try again.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    mediaRef.current?.stream?.getTracks().forEach((t) => t.stop());
    setRecording(false);
    setTimerActive(false);
  };

  const onSubmit = async () => {
    const text = transcript.trim();
    if (!text && !audioBlob) return alert("Please record or type your response before submitting.");
    setSubmitting(true);
    try {
      const r = await submitSession(id, text || "[Audio submission]", audioBlob);
      setResult(r);
      await refreshUser();
    } catch (err) {
      alert(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!pp) {
    return (
      <div className="page flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-outline-variant border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page bg-surface">
      <Navbar title="Voice Session" backTo="/dashboard" />

      <main className="pt-20 pb-8 px-container-margin-mobile max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Task card */}
        <section className="mb-8 mt-4">
          <div className="card p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container shrink-0">
                <Icon name="assignment" />
              </div>
              <div>
                <p className="font-inter text-label-md text-on-surface-variant mb-1">
                  Module {pp.module} · PP-{String(pp.number).padStart(2, "0")}
                </p>
                <p className="font-hanken font-semibold text-primary text-headline-md">{pp.title}</p>
                <p className="font-inter text-body-md text-on-surface-variant mt-2">{pp.scenario}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Yari script */}
        <section className="mb-6">
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-on-primary text-[10px] font-bold">Y</span>
              </div>
              <p className="font-inter font-semibold text-primary text-label-md">Yari says:</p>
            </div>
            <p className="font-inter text-body-md text-on-surface-variant">{pp.ai_agent_script}</p>
          </div>
        </section>

        {/* Tab: Record / Type */}
        <div className="flex bg-surface-container rounded-lg p-1 mb-6">
          {["record", "type"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md text-label-md font-inter font-semibold transition-all ${
                tab === t ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
              }`}>
              {t === "record" ? "🎙 Record" : "⌨️ Type"}
            </button>
          ))}
        </div>

        {tab === "record" ? (
          /* ── RECORD MODE ── */
          <section className="flex-1 flex flex-col items-center space-y-8">
            <Waveform active={recording} />

            <div className="text-center">
              <span className="font-hanken font-black text-primary" style={{ fontSize: 48, letterSpacing: "-0.02em" }}>
                {fmt(timer)}
              </span>
              <p className="font-inter text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">
                {recording ? "Recording…" : "Remaining Time"}
              </p>
            </div>

            {/* Big mic button */}
            <div className="relative group">
              <div className={`absolute -inset-4 rounded-full blur-xl transition-all ${recording ? "bg-secondary/20" : "bg-surface-container"}`} />
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`relative w-24 h-24 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform duration-200 ${
                  recording ? "bg-error" : "bg-secondary"
                }`}
              >
                <Icon name={recording ? "stop" : "mic"} fill size={40} className="text-on-secondary" />
              </button>
            </div>

            {audioBlob && !recording && (
              <p className="font-inter text-label-md text-on-surface-variant flex items-center gap-2">
                <Icon name="check_circle" fill className="text-secondary" size={18} />
                Recording ready to submit
              </p>
            )}
          </section>
        ) : (
          /* ── TYPE MODE ── */
          <section className="flex-1">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="input h-48 resize-none"
              placeholder="Type your response here exactly as you would say it..."
            />
          </section>
        )}

        {/* Action buttons */}
        <section className="mt-8 flex gap-4">
          {tab === "record" && (
            <button
              onClick={stopRecording}
              disabled={!recording}
              className="flex-1 h-14 rounded-lg border-2 border-secondary text-secondary font-inter font-semibold text-label-md hover:bg-surface-container-low transition-colors active:scale-95 duration-200 disabled:opacity-40"
            >
              Stop
            </button>
          )}
          <button
            onClick={onSubmit}
            disabled={submitting || (tab === "record" ? !audioBlob : !transcript.trim())}
            className="flex-1 h-14 btn-primary text-label-md"
          >
            {submitting
              ? <span className="w-5 h-5 border-2 border-on-secondary/40 border-t-on-secondary rounded-full animate-spin" />
              : "Submit"}
          </button>
        </section>

        {/* Hint */}
        {hint && (
          <section className="mt-6">
            {!showHint ? (
              <button onClick={() => setShowHint(true)}
                className="w-full flex items-center justify-center gap-2 text-secondary font-inter font-semibold text-label-md py-3 hover:bg-secondary-container/20 rounded-lg transition-colors">
                <Icon name="lightbulb" size={18} /> Show Hint
              </button>
            ) : (
              <div className="bg-secondary-container/30 border border-secondary-container rounded-xl p-4 flex gap-3">
                <Icon name="lightbulb" className="text-secondary shrink-0 mt-0.5" size={20} />
                <p className="font-inter text-body-md text-on-secondary-container">
                  <span className="font-bold">Coach Tip: </span>{hint.hint}
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      <FeedbackOverlay result={result} onContinue={() => navigate("/dashboard")} />
    </div>
  );
}
