import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Google Sign-In button built on Google Identity Services (GIS).
// Renders the official Google button, then sends the returned ID token
// to our backend, which verifies it and issues the app's own JWT.
const GoogleSignIn = ({ showAlert, mode = "login" }) => {
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const clientRef = useRef(null);

  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
      setConfigError(
        "Google sign-in is not configured. Add your client ID to the .env file (REACT_APP_GOOGLE_CLIENT_ID).",
      );
      return;
    }
    if (!window.google) {
      setConfigError("Google sign-in script failed to load.");
      return;
    }
    if (!buttonRef.current) return;
    setConfigError(null);

    const handleCredential = async (response) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential }),
        });
        const json = await res.json();
        if (json.success && json.authToken) {
          localStorage.setItem("token", json.authToken);
          showAlert(
            mode === "login"
              ? "Logged in with Google"
              : "Account created with Google",
            "success",
          );
          navigate("/");
        } else {
          showAlert(json.error || "Google sign-in failed", "danger");
        }
      } catch (error) {
        console.error("Google sign-in error:", error);
        showAlert("Network or server error", "danger");
      }
    };

    clientRef.current = window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: 366,
      text: mode === "login" ? "signin_with" : "signup_with",
    });
  }, [mode, navigate, showAlert]);

  return (
    <div className="google-signin">
      <div className="auth-divider">
        <span>or continue with</span>
      </div>
      {configError ? (
        <p className="google-config-error">{configError}</p>
      ) : (
        <div ref={buttonRef} className="google-btn-wrap" />
      )}
    </div>
  );
};

export default GoogleSignIn;
