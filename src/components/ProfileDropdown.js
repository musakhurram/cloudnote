import React, { useEffect, useRef, useState } from "react";

// Profile dropdown — anchored to the avatar chip in the navbar.
// Shows the signed-in user's name, email and member-since date.
const ProfileDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const initial =
    user && user.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  // Google sign-in users have a profile picture — show it when available.
  const avatar = user && user.picture ? (
    <img className="avatar-img" src={user.picture} alt={user.name || "Account"} />
  ) : (
    initial
  );

  return (
    <div className="nav-user" ref={ref}>
      <button
        type="button"
        className={`nav-avatar ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        title={user ? user.name : "Account"}
      >
        {avatar}
      </button>

      {open && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-head">
            <span className="profile-avatar">{avatar}</span>
            <div className="profile-id">
              <strong>{user ? user.name : "Account"}</strong>
              <span>{user ? user.email : ""}</span>
            </div>
          </div>
          <div className="profile-meta">
            <div className="profile-meta-row">
              <i className="fa-solid fa-envelope" aria-hidden="true"></i>
              <span>{user ? user.email : "—"}</span>
            </div>
            <div className="profile-meta-row">
              <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
              <span>
                {user && user.date
                  ? `Member since ${new Date(user.date).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long" },
                    )}`
                  : "—"}
              </span>
            </div>
          </div>
          <div className="profile-actions">
            <button
              type="button"
              className="btn btn-danger-ghost btn-block"
              onClick={onLogout}
            >
              <i
                className="fa-solid fa-arrow-right-from-bracket"
                aria-hidden="true"
              ></i>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
