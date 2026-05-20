import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/Icon";

const NAV = [
  { to: "/company",          icon: "dashboard", label: "Dashboard",  end: true },
  { to: "/company/students", icon: "group",     label: "Candidates"             },
  { to: "/company/matches",  icon: "analytics", label: "Matches"                },
];

export default function CompanyLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col h-screen w-sidebar-width fixed left-0 top-0 z-50 bg-primary border-r border-outline-variant">
        <div className="px-6 py-8">
          <div className="flex items-center gap-2 mb-1">
            <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 140 L100 60 L140 140" fill="none" stroke="#7df6ef" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M80 105 L120 105" fill="none" stroke="#abc7ff" strokeWidth="20" strokeLinecap="round"/>
            </svg>
            <h1 className="font-hanken font-bold text-on-primary text-headline-lg-mobile">GrowthYari</h1>
          </div>
          <p className="font-inter text-label-md text-on-primary/60">Hiring Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-container/20 text-on-primary border-l-4 border-secondary"
                    : "text-on-primary/70 hover:text-on-primary hover:bg-primary-container/10"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={icon} fill={isActive} className="shrink-0" />
                  <span className="font-inter text-label-md">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-on-primary/10 space-y-1">
          <div className="px-4 py-3 text-on-primary/70">
            <p className="font-inter font-semibold text-label-md text-on-primary">{user?.name}</p>
            <p className="font-inter text-label-sm text-on-primary/50">{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-on-primary/70 hover:text-on-primary hover:bg-primary-container/10 rounded-lg transition-colors">
            <Icon name="logout" />
            <span className="font-inter text-label-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Top bar (mobile) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-primary h-16 flex items-center justify-between px-4">
        <span className="font-hanken font-bold text-on-primary text-headline-md">GrowthYari</span>
        <button onClick={handleLogout}>
          <Icon name="logout" className="text-on-primary/70" />
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-sidebar-width pt-16 md:pt-0 min-h-screen bg-surface-bright">
        {children}
      </main>
    </div>
  );
}
