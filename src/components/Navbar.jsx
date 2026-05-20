import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

export default function Navbar({ title, backTo }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-bright/90 backdrop-blur-md shadow-sm flex justify-between items-center px-container-margin-mobile h-16">
      <div className="flex items-center gap-3">
        {backTo ? (
          <button
            onClick={() => navigate(backTo)}
            className="active:scale-95 transition-transform text-on-surface-variant p-2 -ml-2"
          >
            <Icon name="arrow_back" />
          </button>
        ) : null}

        {!backTo && (
          <Link to={user ? (user.role === "company" ? "/company" : "/dashboard") : "/"} className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 140 L100 60 L140 140" fill="none" stroke="#006a66" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M80 105 L120 105" fill="none" stroke="#002451" strokeWidth="18" strokeLinecap="round"/>
            </svg>
            <span className="font-bold text-primary text-headline-md font-hanken leading-none">
              GrowthYari
            </span>
          </Link>
        )}

        {title && (
          <h1 className="font-hanken font-bold text-headline-lg-mobile text-primary">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <button className="text-on-surface-variant p-2 active:scale-95 transition-transform">
            <Icon name="notifications" />
          </button>
        )}
        {user && !backTo && (
          <button
            onClick={handleLogout}
            className="text-on-surface-variant p-2 active:scale-95 transition-transform"
            title="Sign out"
          >
            <Icon name="logout" />
          </button>
        )}
        {!user && (
          <Link to="/login" className="text-label-md text-on-surface-variant hover:text-primary transition-colors font-inter">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
