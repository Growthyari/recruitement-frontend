import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register, getMe } from "../services/api";
import Icon from "../components/Icon";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

export default function Register() {
  const { loginWith } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    city: "", college: "", year: 1,
    role: params.get("role") || "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "year" ? Number(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { access_token } = await register(form);
      localStorage.setItem("gy_token", access_token);
      const me = await getMe();
      loginWith(access_token, me);
      navigate(me.role === "company" ? "/company" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isCompany = form.role === "company";

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="flex items-center px-container-margin-mobile h-16 border-b border-outline-variant">
        <Link to="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 140 L100 60 L140 140" fill="none" stroke="#006a66" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M80 105 L120 105" fill="none" stroke="#002451" strokeWidth="20" strokeLinecap="round"/>
          </svg>
          <span className="font-hanken font-bold text-primary text-headline-md">GrowthYari</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-container-margin-mobile py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-hanken font-bold text-primary text-headline-lg-mobile mb-2">
              {isCompany ? "Access Verified Talent" : "Start Your Grit Journey"}
            </h1>
            <p className="text-body-md font-inter text-on-surface-variant">
              {isCompany ? "Create a company account to browse candidates." : "Free. AI-powered. Built for Tier-2 talent."}
            </p>
          </div>

          {/* Role toggle */}
          <div className="flex bg-surface-container rounded-lg p-1 mb-6">
            {["student", "company"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className={`flex-1 py-2 rounded-md text-label-md font-inter font-semibold transition-all ${
                  form.role === r
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {r === "student" ? "Student" : "Company / Recruiter"}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label font-inter">{isCompany ? "Company Name" : "Full Name"}</label>
              <input name="name" value={form.name} onChange={onChange} className="input"
                placeholder={isCompany ? "Acme Corp" : "Priya Sharma"} required />
            </div>
            <div>
              <label className="label font-inter">Email</label>
              <input name="email" type="email" value={form.email} onChange={onChange}
                className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label font-inter">Password</label>
              <input name="password" type="password" value={form.password} onChange={onChange}
                className="input" placeholder="8+ characters" required minLength={8} />
            </div>
            <div>
              <label className="label font-inter">City</label>
              <input name="city" value={form.city} onChange={onChange} className="input"
                placeholder={isCompany ? "Mumbai" : "Jaipur"} required />
            </div>

            {!isCompany && (
              <>
                <div>
                  <label className="label font-inter">College</label>
                  <input name="college" value={form.college} onChange={onChange} className="input"
                    placeholder="MNIT Jaipur" required />
                </div>
                <div>
                  <label className="label font-inter">Year of Study</label>
                  <select name="year" value={form.year} onChange={onChange} className="input">
                    {YEARS.map((y, i) => (
                      <option key={i} value={i + 1}>{y}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {isCompany && (
              <input name="college" value="Company" onChange={() => {}} type="hidden" />
            )}

            {error && (
              <div className="flex items-center gap-2 text-error text-label-md font-inter bg-error-container rounded-lg px-4 py-3">
                <Icon name="error" size={18} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-body-md mt-2">
              {loading
                ? <span className="w-5 h-5 border-2 border-on-secondary/40 border-t-on-secondary rounded-full animate-spin" />
                : isCompany ? "Create Company Account" : "Create My Account — It's Free"}
            </button>
          </form>

          <p className="text-center text-body-md font-inter text-on-surface-variant mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
