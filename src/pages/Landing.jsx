import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import DimBar from "../components/DimBar";

const STATS = [
  { value: "110+",    label: "Candidates Placed" },
  { value: "1,200+", label: "Community Members" },
  { value: "₹15L+",  label: "Revenue Contracted" },
  { value: "4–6 LPA",label: "Average Placement" },
];

const HOW_STEPS = [
  { icon: "assignment_ind", color: "bg-primary", label: "1. Enrol & Assess",   desc: "Baseline testing to understand your strengths and current skill gaps." },
  { icon: "record_voice_over", color: "bg-secondary", label: "2. AI Training", desc: "Daily voice-simulations that mimic real interview scenarios and pitch calls." },
  { icon: "shield", color: "bg-primary", label: "3. Evidence Locker",          desc: "Compile verified proofs of your work, voice scores, and project outcomes." },
  { icon: "handshake", color: "bg-secondary", label: "4. Match & Hire",        desc: "Direct connections with hiring managers looking for verified talent." },
];

const FOR_STUDENTS = [
  { title: "Overcome the Resume Filter",    desc: "Let your verified Grit Score speak louder than your college name." },
  { title: "Real-World Practice",          desc: "100 proof-point challenges built on actual sales and interview scenarios." },
  { title: "Get Placed at Premium Roles",  desc: "Be matched directly with companies looking for growth-ready talent." },
];

const FOR_RECRUITERS = [
  { title: "Skip the Screening Queue",      desc: "Every candidate has completed verifiable AI-scored voice assessments." },
  { title: "Filter by Grit Score",          desc: "Set a minimum Grit Score threshold and surface only your top matches." },
  { title: "Interview-Ready Candidates",    desc: "No more ghosting. Only candidates who have proven they show up." },
];

const DEMO_SCORES = [
  { label: "Clarity",    value: 92 },
  { label: "Persuasion", value: 84 },
  { label: "Structure",  value: 88 },
  { label: "Confidence", value: 79 },
  { label: "Relevance",  value: 94 },
];

export default function Landing() {
  return (
    <div className="bg-surface text-on-surface">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-surface-bright/90 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-[1440px] mx-auto px-margin-desktop h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 140 L100 60 L140 140" fill="none" stroke="#006a66" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M80 105 L120 105" fill="none" stroke="#002451" strokeWidth="18" strokeLinecap="round"/>
            </svg>
            <span className="font-hanken font-bold text-primary text-headline-md">GrowthYari</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how" className="text-label-md font-inter text-on-surface-variant hover:text-primary transition-colors">How it Works</a>
            <a href="#students" className="text-label-md font-inter text-on-surface-variant hover:text-primary transition-colors">For Students</a>
            <a href="#recruiters" className="text-label-md font-inter text-on-surface-variant hover:text-primary transition-colors">For Recruiters</a>
            <Link to="/login" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-label-md font-inter hover:opacity-90 transition-all">
              Sign In
            </Link>
          </div>
          <Link to="/login" className="md:hidden bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md font-inter">
            Sign In
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-16 pb-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full border border-secondary/20">
              <Icon name="verified" size={18} />
              <span className="text-label-sm font-inter uppercase tracking-wider">India's First Verified Hiring Network</span>
            </div>
            <h1 className="font-hanken font-bold text-primary leading-tight" style={{ fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.1 }}>
              Making 6 LPA the New<br />Normal for Tier-2 Talent
            </h1>
            <p className="text-body-lg font-inter text-on-surface-variant max-w-xl">
              AI voice training and data-backed Evidence Lockers that help you bypass tier-bias and land premium roles in high-growth companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/register" className="btn-primary text-body-md px-8 py-4">
                Start Training Free <Icon name="arrow_forward" />
              </Link>
              <Link to="/register?role=company" className="btn-outline text-body-md px-8 py-4">
                Hire Verified Talent
              </Link>
            </div>
          </div>

          {/* Right — Grit Score widget */}
          <div className="relative">
            <div className="absolute -inset-4 bg-secondary/5 rounded-3xl blur-3xl" />
            <div className="relative card p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-hanken font-semibold text-headline-md text-primary">Grit Score™</h3>
                  <p className="text-label-md font-inter text-on-surface-variant">Real-time Performance Analysis</p>
                </div>
                <Icon name="analytics" size={32} className="text-secondary" />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Ring */}
                <div className="relative w-40 h-40 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="66" fill="transparent" stroke="#dee8ff" strokeWidth="12" />
                    <circle cx="80" cy="80" r="66" fill="transparent" stroke="#006a66"
                      strokeWidth="12" strokeLinecap="round"
                      strokeDasharray="414.7" strokeDashoffset="53.6" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-hanken font-black text-primary" style={{ fontSize: 44 }}>87</span>
                    <span className="text-label-md font-inter text-on-surface-variant">Top 4%</span>
                  </div>
                </div>
                {/* Bars */}
                <div className="flex-1 w-full space-y-4">
                  {DEMO_SCORES.map((s) => <DimBar key={s.label} {...s} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-primary py-12">
        <div className="max-w-[1440px] mx-auto px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className={`text-center ${i > 0 ? "border-l border-on-primary/10" : ""}`}>
              <div className="font-hanken font-bold text-on-primary text-headline-xl-mobile">{s.value}</div>
              <div className="text-label-md font-inter text-primary-fixed-dim mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24">
        <div className="max-w-[1440px] mx-auto px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-hanken font-bold text-primary text-headline-xl-mobile md:text-headline-xl mb-4">The Highway to Premium Roles</h2>
            <p className="text-body-lg font-inter text-on-surface-variant max-w-2xl mx-auto">
              Skip the generic job boards. Our structured journey ensures you are ready before you even apply.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {HOW_STEPS.map((s) => (
              <div key={s.label} className="card p-8">
                <div className={`w-12 h-12 ${s.color} rounded-lg flex items-center justify-center mb-6 text-on-primary`}>
                  <Icon name={s.icon} />
                </div>
                <h3 className="font-hanken font-semibold text-headline-md text-primary mb-3">{s.label}</h3>
                <p className="text-body-md font-inter text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR STUDENTS ── */}
      <section id="students" className="py-24 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-hanken font-bold text-primary text-headline-xl-mobile md:text-headline-xl mb-8">
              Built for the Ambitious Tier-2 Student
            </h2>
            <div className="space-y-6">
              {FOR_STUDENTS.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <Icon name="check_circle" fill className="text-secondary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-hanken font-semibold text-headline-md text-primary">{item.title}</h4>
                    <p className="text-body-md font-inter text-on-surface-variant mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link to="/register" className="btn-primary px-8 py-4 text-body-md w-fit">
                Start Your Journey <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
          <div className="card p-8 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container">P</div>
              <div>
                <p className="font-hanken font-semibold text-on-surface">Priya Sharma</p>
                <p className="text-label-md font-inter text-on-surface-variant">BBA, Jaipur · Grit 84 · Level 4</p>
              </div>
            </div>
            <div className="bg-secondary-container/20 rounded-lg p-4 border border-secondary/20">
              <p className="text-body-md font-inter text-on-surface-variant italic">
                "I was rejected from 14 companies. After 60 proof points on GrowthYari, I got 3 offers in the same week. My Grit Score did the talking."
              </p>
            </div>
            {[{ label: "Clarity", value: 89 }, { label: "Confidence", value: 84 }].map((d) => (
              <DimBar key={d.label} {...d} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR RECRUITERS ── */}
      <section id="recruiters" className="py-24">
        <div className="max-w-[1440px] mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 card p-8 space-y-4">
            <h3 className="font-hanken font-semibold text-headline-md text-primary mb-4">Candidate Pool · 128 Verified</h3>
            {[
              { name: "Arjun Kapoor",  city: "Bangalore", grit: 92, level: 4, skill: "B2B Sales" },
              { name: "Priya Sharma",  city: "Jaipur",    grit: 84, level: 4, skill: "SaaS Demo" },
              { name: "Rahul Verma",   city: "Pune",      grit: 87, level: 4, skill: "Cold Calls" },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-4 py-3 border-b border-outline-variant last:border-0">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-hanken font-semibold text-on-surface text-body-md">{c.name}</p>
                  <p className="text-label-md font-inter text-on-surface-variant truncate">{c.city} · {c.skill}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-teal">{c.grit}</span>
                  <span className="badge-navy">L{c.level}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-hanken font-bold text-primary text-headline-xl-mobile md:text-headline-xl mb-8">
              Hire Verified, Not Filtered
            </h2>
            <div className="space-y-6">
              {FOR_RECRUITERS.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <Icon name="check_circle" fill className="text-secondary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-hanken font-semibold text-headline-md text-primary">{item.title}</h4>
                    <p className="text-body-md font-inter text-on-surface-variant mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link to="/register?role=company" className="btn-outline px-8 py-4 text-body-md w-fit">
                Access Talent Pool <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-primary py-10 text-center">
        <p className="font-hanken font-bold text-on-primary text-headline-md mb-1">GrowthYari</p>
        <p className="text-label-md font-inter text-primary-fixed-dim">© 2026 · Making 6 LPA the New Normal</p>
      </footer>
    </div>
  );
}
