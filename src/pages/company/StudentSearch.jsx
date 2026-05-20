import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents } from "../../services/api";
import CompanyLayout from "./CompanyLayout";
import LevelBadge from "../../components/LevelBadge";
import Icon from "../../components/Icon";

const CITIES = ["All Cities", "Bangalore", "Mumbai", "Pune", "Delhi", "Jaipur", "Hyderabad", "Chennai"];

export default function StudentSearch() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({ min_score: 0, city: "" });
  const [gritInput, setGritInput] = useState(0);
  const [search, setSearch]     = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { min_score: filters.min_score };
      const data = await getStudents(params);
      setStudents(data);
    } finally {
      setLoading(false);
    }
  }, [filters.min_score]);

  useEffect(() => { load(); }, [load]);

  const handleGrit = (v) => {
    setGritInput(v);
    setFilters((f) => ({ ...f, min_score: Number(v) }));
  };

  const filtered = students.filter((s) => {
    if (filters.city && s.city !== filters.city) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.college?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <CompanyLayout>
      {/* Top bar */}
      <header className="hidden md:flex items-center justify-between h-16 px-gutter border-b border-outline-variant bg-surface-bright sticky top-0 z-40">
        <div className="relative w-full max-w-md">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 py-2"
            placeholder="Search candidates, cities, colleges…" />
        </div>
        <span className="font-inter text-label-md text-on-surface-variant ml-4 shrink-0">
          {filtered.length} candidates
        </span>
      </header>

      <div className="flex gap-gutter p-gutter max-w-[1200px] mx-auto">
        {/* ── Filter sidebar ── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="card p-6 space-y-8 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-hanken font-semibold text-headline-md text-on-surface">Filters</h2>
              <button onClick={() => { setFilters({ min_score: 0, city: "" }); setGritInput(0); }}
                className="font-inter text-label-md text-secondary hover:underline">Reset</button>
            </div>

            {/* Grit slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="label uppercase tracking-wider">Min. Grit Score</label>
                <span className="font-hanken font-bold text-secondary text-headline-md">{gritInput}</span>
              </div>
              <input type="range" min="0" max="100" value={gritInput}
                onChange={(e) => handleGrit(e.target.value)}
                className="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-secondary" />
              <div className="flex justify-between text-label-sm font-inter text-outline mt-1">
                <span>0</span><span>100</span>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="label uppercase tracking-wider">Location</label>
              <div className="relative mt-1">
                <select value={filters.city}
                  onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value === "All Cities" ? "" : e.target.value }))}
                  className="input appearance-none pr-10">
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Candidate table ── */}
        <section className="flex-1 min-w-0">
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
              <h2 className="font-hanken font-semibold text-headline-md text-on-surface">
                Candidate Pool
                <span className="text-on-surface-variant font-normal ml-2 text-body-md">({filtered.length})</span>
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface border-b border-outline-variant">
                    {["Name", "City", "Grit Score", "Level", "Streak", ""].map((h) => (
                      <th key={h} className="px-6 py-4 font-inter text-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {loading ? (
                    [1,2,3,4,5].map((i) => (
                      <tr key={i}><td colSpan={6} className="px-6 py-4">
                        <div className="h-4 bg-surface-container animate-pulse rounded w-3/4" />
                      </td></tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-16 text-center">
                      <Icon name="search_off" size={40} className="text-on-surface-variant mx-auto mb-3" />
                      <p className="font-hanken font-semibold text-on-surface">No candidates found</p>
                      <p className="font-inter text-body-md text-on-surface-variant mt-1">Try adjusting your filters.</p>
                    </td></tr>
                  ) : filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors cursor-pointer"
                      onClick={() => navigate(`/company/students/${s.id}`)}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm">
                            {s.name?.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-inter font-semibold text-on-surface text-body-md">{s.name}</p>
                            <p className="font-inter text-label-md text-on-surface-variant">{s.college}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-inter text-body-md text-on-surface-variant whitespace-nowrap">{s.city}</td>
                      <td className="px-6 py-5">
                        <span className="badge-teal">{Math.round(s.grit_score)}</span>
                      </td>
                      <td className="px-6 py-5">
                        <LevelBadge level={s.level} />
                      </td>
                      <td className="px-6 py-5 font-inter text-body-md text-on-surface-variant">
                        {s.streak > 0 ? `🔥 ${s.streak}` : "—"}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="btn-primary py-1.5 px-4 text-label-md"
                          onClick={(e) => { e.stopPropagation(); navigate(`/company/students/${s.id}`); }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </CompanyLayout>
  );
}
