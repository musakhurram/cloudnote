import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import NoteContext from "../context/notes/NoteContext";
import ThemeContext from "../context/theme/ThemeContext";

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
      fill="#F3F0E4"
    />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const context = useContext(NoteContext);
  const { setNotes } = context;
  const { theme, setThemePreference } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState("");

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Elevate the navbar once the page is scrolled — a quiet depth cue.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Greet the signed-in user by name (initial shown in the avatar chip).
  useEffect(() => {
    if (!isLoggedIn) {
      setUserName("");
      return;
    }
    let cancelled = false;
    fetch("http://localhost:5000/api/auth/getuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (!cancelled && user && user.name) setUserName(user.name);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setNotes([]);
    setUserName("");
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const isDark = theme === "dark";
  const toggleTheme = () => setThemePreference(isDark ? "light" : "dark");

  return (
    <nav className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-inner">
          <NavLink className="brand" to="/" onClick={closeMenu}>
            <span className="brand-icon">
              <i className="fa-solid fa-cloud" aria-hidden="true"></i>
            </span>
            <span className="brand-text">
              Cloud<span className="brand-accent">Note</span>
            </span>
          </NavLink>
          <button
            className="nav-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <i
              className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}
              aria-hidden="true"
            ></i>
          </button>
        </div>

        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          <div className="nav-actions">
            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              to="/about"
              onClick={closeMenu}
            >
              <i className="fa-solid fa-circle-info" aria-hidden="true"></i>{" "}
              About
            </NavLink>

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
              <div className="nav-user">
                <span
                  className="nav-avatar"
                  title={userName || "Account"}
                  aria-hidden="true"
                >
                  {userName ? userName.trim().charAt(0).toUpperCase() : "U"}
                </span>
                <button
                  type="button"
                  className="btn btn-danger-ghost"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <i
                    className="fa-solid fa-arrow-right-from-bracket"
                    aria-hidden="true"
                  ></i>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink
                  className="btn btn-ghost"
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  className="btn btn-primary"
                  to="/signup"
                  onClick={closeMenu}
                >
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
