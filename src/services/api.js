const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

const MOCK = import.meta.env.VITE_MOCK_AUTH === "true";

// ─── Mock data (server-response format, used when VITE_MOCK_AUTH=true) ────────
const MOCK_TASK = {
  id: "task-cold-call", module: 1, number: 1,
  title: "Cold Call: SaaS for College Cafeterias",
  concept: "Open a cold call with energy and earn 30 seconds of attention from a skeptical prospect.",
  ai_agent_script: "Yari: The canteen manager gets 10 calls a day. You have exactly 10 seconds before they hang up. Make every word count — go!",
  hint_text: "Open with the campus name + a specific pain point. Then ask for a 15-minute demo, not a sale.",
  scenario: "You sell CafeFlow, a SaaS that helps college cafeterias reduce food waste. Cold call the canteen manager of a 5,000-student campus.",
  duration_target: 60, difficulty: "Beginner", skill: "Cold Outreach",
};

const MOCK_RESPONSES = {
  "/auth/me": { user: {
    id: "dev-id", name: "Priya Sharma", email: "priya@test.com",
    username: "priya_sharma", role: "student", city: "Jaipur", college: "MNIT Jaipur", year: "3",
    level: 3, grit_score: 72, streak: 7, submissions_count: 5,
    clarity_avg: 74, persuasion_avg: 68, structure_avg: 77, confidence_avg: 65, relevance_avg: 80,
  }},
  "/tasks/today": { task: MOCK_TASK, submission: null },
  "/leaderboard": { leaderboard: [
    { id: "1", name: "Rahul M.", grit_score: 91, level: 5, city: "Mumbai", college: "BITS Pilani" },
    { id: "2", name: "Ananya K.", grit_score: 88, level: 5, city: "Pune", college: "NMIMS" },
    { id: "3", name: "Dev S.", grit_score: 85, level: 5, city: "Ahmedabad", college: "NIT Surat" },
    { id: "4", name: "Priya Sharma", grit_score: 72, level: 3, city: "Jaipur", college: "MNIT Jaipur" },
  ]},
  "/submissions/me": { submissions: [] },
  "/students": { students: [] },
};

function mockMatch(path) {
  if (MOCK_RESPONSES[path]) return MOCK_RESPONSES[path];
  if (path.startsWith("/tasks/")) return MOCK_TASK;
  if (path.startsWith("/hint/")) return { hint: MOCK_TASK.hint_text };
  if (path.startsWith("/submissions")) return { submission: {
    id: "mock-sub", grit_score: 74,
    scores: { clarity: 15, persuasion: 14, structure: 15, confidence: 13, relevance: 16 },
    highlight: "Strong opening hook.", improvement: "Slow down on the key benefit statement.",
    coach_note: "You earned their attention — now work on the pivot.",
  }};
  return null;
}

// ─── Core request ─────────────────────────────────────────────────────────────
function token() {
  return localStorage.getItem("gy_token");
}

function headers(isFormData = false) {
  const h = { Authorization: `Bearer ${token()}` };
  if (!isFormData) h["Content-Type"] = "application/json";
  return h;
}

async function request(method, path, body, isFormData = false) {
  if (MOCK) { const m = mockMatch(path); if (m) return Promise.resolve(m); }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(isFormData),
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Scale per-dimension scores from server range (0-20) to display range (0-100)
function scaleScores(scores) {
  if (!scores) return {};
  return Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, v * 5]));
}

function flattenSubmission(s) {
  const scaled = scaleScores(s.scores || {});
  return {
    ...s,
    clarity:    scaled.clarity    ?? 0,
    persuasion: scaled.persuasion ?? 0,
    structure:  scaled.structure  ?? 0,
    confidence: scaled.confidence ?? 0,
    relevance:  scaled.relevance  ?? 0,
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const register = (data) => request("POST", "/auth/register", data);
export const login    = (data) => request("POST", "/auth/login", data);
export const getMe    = ()     => request("GET", "/auth/me").then((r) => r.user);

// ─── Student ──────────────────────────────────────────────────────────────────
export const getTodayTask    = () => request("GET", "/tasks/today").then((r) => r);
export const getTask         = (id) => request("GET", `/tasks/${id}`);
export const getHint         = (id) => request("GET", `/hint/${id}`);
export const getMySubmissions = () =>
  request("GET", "/submissions/me").then((r) => (r.submissions || []).map(flattenSubmission));
export const getLeaderboard  = () => request("GET", "/leaderboard").then((r) => r.leaderboard || []);

export async function submitSession(taskId, transcript, audioBlob) {
  let audio_data_url = null;
  if (audioBlob) {
    try { audio_data_url = await blobToBase64(audioBlob); } catch {}
  }
  const raw = await request("POST", "/submissions", {
    task_id: taskId,
    transcript: transcript || "",
    audio_data_url,
    duration_seconds: null,
  });
  const sub = raw.submission || raw;
  return {
    ...sub,
    scores: scaleScores(sub.scores),
  };
}

// ─── Company ──────────────────────────────────────────────────────────────────
export const getStudents = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request("GET", `/students${q ? "?" + q : ""}`).then((r) => r.students || []);
};

export const getStudent = (id) =>
  request("GET", `/students/${id}`).then((r) => ({
    ...r.student,
    recent_sessions: (r.evidence || []).map(flattenSubmission),
  }));

export const createRole      = (data) => request("POST", "/roles", data);
export const getMatches      = ()     => request("GET", "/matches/me").then((r) => r.matches || []);
export const requestInterview = (data) => request("POST", "/interviews/request", data);

// ─── Yari Journey ─────────────────────────────────────────────────────────────
export const analyzeResponse = (data) =>
  fetch(`${BASE}/evaluate/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const saveBaseline = (data) =>
  fetch(`${BASE}/users/baseline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const saveMicrolearnSession = (data) =>
  fetch(`${BASE}/microlearn/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

// ─── Public ───────────────────────────────────────────────────────────────────
export const getPublicProfile = (username) =>
  fetch(`${BASE}/candidate/${username}`).then((r) => r.json());
