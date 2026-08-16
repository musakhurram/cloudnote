import React from "react";
import { Link, useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="page">
      <button type="button" className="about-back" onClick={handleBack}>
        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
        Back
      </button>

      <div className="about-hero">
        <div className="auth-tag">About CloudNote</div>
        <h1 className="page-title">Notes, engineered for the future</h1>
        <p>
          CloudNote is a fast, secure cloud note-taking app built with React and a
          modern Node.js backend. Your ideas, always in sync.
        </p>
        <div className="about-stack">
          <span>
            <i className="fa-brands fa-react" aria-hidden="true"></i>
            React
          </span>
          <span>
            <i className="fa-brands fa-node-js" aria-hidden="true"></i>
            Node.js
          </span>
          <span>
            <i className="fa-solid fa-server" aria-hidden="true"></i>
            Express
          </span>
          <span>
            <i className="fa-solid fa-leaf" aria-hidden="true"></i>
            MongoDB
          </span>
        </div>
      </div>

      <p className="about-section-label">What you get</p>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">01</div>
          <div>
            <h3>Cloud Synced</h3>
            <p>
              Every note is stored securely and accessible from any device with your
              account.
            </p>
          </div>
          <i className="fa-solid fa-arrow-right feature-card-arrow" aria-hidden="true"></i>
        </div>

        <div className="feature-card">
          <div className="feature-icon">02</div>
          <div>
            <h3>Private & Secure</h3>
            <p>
              Your data stays yours. Authentication protects every request and keeps
              notes isolated per user.
            </p>
          </div>
          <i className="fa-solid fa-arrow-right feature-card-arrow" aria-hidden="true"></i>
        </div>

        <div className="feature-card">
          <div className="feature-icon">03</div>
          <div>
            <h3>Lightning Fast</h3>
            <p>
              A lightweight React frontend and optimized backend give you an
              instant, responsive experience.
            </p>
          </div>
          <i className="fa-solid fa-arrow-right feature-card-arrow" aria-hidden="true"></i>
        </div>

        <div className="feature-card">
          <div className="feature-icon">04</div>
          <div>
            <h3>Smart Tagging</h3>
            <p>
              Organize with tags so you can always find exactly what you're looking
              for.
            </p>
          </div>
          <i className="fa-solid fa-arrow-right feature-card-arrow" aria-hidden="true"></i>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="about-cta">
          <h2>Ready to get organized?</h2>
          <p>Create a free account and your first note is a minute away.</p>
          <Link to="/signup" className="btn btn-primary">
            <i className="fa-solid fa-user-plus" aria-hidden="true"></i>
            Create free account
          </Link>
        </div>
      )}
    </div>
  );
};

export default About;
