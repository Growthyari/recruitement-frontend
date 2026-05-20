import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const STUDENT_TABS = [
  { to: "/dashboard",   icon: "home",         label: "Home" },
  { to: "/history",     icon: "history",      label: "Sessions" },
  { to: "/leaderboard", icon: "leaderboard",  label: "Ranks" },
];

const COMPANY_TABS = [
  { to: "/company",          icon: "dashboard",  label: "Overview" },
  { to: "/company/students", icon: "group",      label: "Talent" },
  { to: "/company/matches",  icon: "analytics",  label: "Matches" },
];

export default function BottomNav({ role = "student" }) {
  const tabs = role === "company" ? COMPANY_TABS : STUDENT_TABS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant flex md:hidden">
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/company"}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
              isActive ? "text-secondary" : "text-on-surface-variant"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={icon} fill={isActive} size={22} />
              <span className="text-[10px] font-semibold font-inter tracking-wide">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
