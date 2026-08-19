import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import NoteContext from "../../context/notes/NoteContext";
import ThemeContext from "../../context/theme/ThemeContext";
import ProfileDropdown from "../auth/ProfileDropdown";
import API_URL from "../../config";

// Custom sun / moon marks for the theme toggle — drawn rather than pulled
// from the icon font so each can carry its own tone (warm amber for day,
// cool slate for night) instead of inheriting a single icon color.
const SunMark = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" fill="#FFFDF7" />
    <g stroke="#FFFDF7" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22.5" y2="12" />
      <line x1="4.4" y1="4.4" x2="6.1" y2="6.1" />
      <line x1="17.9" y1="17.9" x2="19.6" y2="19.6" />
      <line x1="4.4" y1="19.6" x2="6.1" y2="17.9" />
      <line x1="17.9" y1="6.1" x2="19.6" y2="4.4" />
    </g>
  </svg>
);

const MoonMark = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.5 14.2c-1.1.5-2.3.8-3.6.8-4.7 0-8.5-3.8-8.5-8.5 0-1.3.3-2.5.8-3.6C5.4 3.9 2.5 7.6 2.5 12c0 5.2 4.3 9.5 9.5 9.5 4.4 0 8.1-2.9 9.2-6.9.1-.2 0-.4-.2-.5-.2-.1-.4 0-.5.1z"
      fill="#FFFDF7"
    />
    <circle cx="16.5" cy="6.5" r="0.9" fill="#FFFDF7" opacity="0.85" />
    <circle cx="12.5" cy="4.2" r="0.6" fill="#FFFDF7" opacity="0.65" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const context = useContext(NoteContext);
  const { setNotes } = context;
  const { theme, setThemePreference } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Elevate the navbar once the page is scrolled — a quiet depth cue.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load the signed-in user's profile (name, email, member since).
  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      return;
    }
    let cancelled = false;
    fetch(`${API_URL}/api/auth/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && data.name) setUser(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setNotes([]);
    setUser(null);
    navigate("/login");
  };

  const isDark = theme === "dark";
  const toggleTheme = () => setThemePreference(isDark ? "light" : "dark");

  return (
    <nav className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-inner">
          <NavLink className="brand" to="/">
            <span className="brand-icon">
              <i className="fa-solid fa-cloud" aria-hidden="true"></i>
            </span>
            <span className="brand-text">
              Cloud<span className="brand-accent">Note</span>
            </span>
          </NavLink>

          {/* Always visible — no hamburger/collapsed menu. About sits
              next to the brand; the theme toggle and profile chip (or
              login/signup) are pinned to the far right edge, at every
              screen size, so they're never hidden on mobile. */}
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            to="/about"
          >
            <i className="fa-solid fa-circle-info" aria-hidden="true"></i>{" "}
            <span className="nav-link-text">About</span>
          </NavLink>

          <div className="nav-actions">
            <button
              type="button"
              className={`theme-toggle ${isDark ? "is-dark" : ""}`}
              onClick={toggleTheme}
              role="switch"
              aria-checked={isDark}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              <span className="theme-toggle-thumb">
                {isDark ? <MoonMark /> : <SunMark />}
              </span>
            </button>

            {isLoggedIn ? (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              <>
                <NavLink className="btn btn-ghost" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-primary" to="/signup">
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;