import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login, getMe } from "../services/api";
import Icon from "../components/Icon";

export default function Login() {
  const { loginWith } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { access_token } = await login(form);
      localStorage.setItem("gy_token", access_token);
      const me = await getMe();
      loginWith(access_token, me);
      navigate(me.role === "company" ? "/company" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="flex items-center px-container-margin-mobile h-16 border-b border-outline-variant">
        <Link to="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 140 L100 60 L140 140" fill="none" stroke="#006a66" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M80 105 L120 105" fill="none" stroke="#002451" strokeWidth="20" strokeLinecap="round"/>
          </svg>
          <span className="font-hanken font-bold text-primary text-headline-md">GrowthYari</span>
        </Link>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-container-margin-mobile">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-hanken font-bold text-primary text-headline-lg-mobile mb-2">Welcome back</h1>
            <p className="text-body-md font-inter text-on-surface-variant">Sign in to continue your Grit journey</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="label font-inter">Email address</label>
              <input name="email" type="email" value={form.email} onChange={onChange}
                className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label font-inter">Password</label>
              <input name="password" type="password" value={form.password} onChange={onChange}
                className="input" placeholder="••••••••" required />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-error text-label-md font-inter bg-error-container rounded-lg px-4 py-3">
                <Icon name="error" size={18} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-body-md mt-2">
              {loading ? <span className="w-5 h-5 border-2 border-on-secondary/40 border-t-on-secondary rounded-full animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-body-md font-inter text-on-surface-variant mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-secondary font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
