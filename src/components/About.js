import React from "react";

const About = () => {
  return (
    <div className="page">
      <div className="about-hero">
        <div className="auth-tag">About CloudNote</div>
        <h1 className="page-title">Notes, engineered for the future</h1>
        <p>
          CloudNote is a fast, secure cloud note-taking app built with React and a
          modern Node.js backend. Your ideas, always in sync.
        </p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <i className="fa-solid fa-cloud" aria-hidden="true"></i>
          </div>
          <h3>Cloud Synced</h3>
          <p>
            Every note is stored securely and accessible from any device with your
            account.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
          </div>
          <h3>Private & Secure</h3>
          <p>
            Your data stays yours. Authentication protects every request and keeps
            notes isolated per user.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fa-solid fa-bolt" aria-hidden="true"></i>
          </div>
          <h3>Lightning Fast</h3>
          <p>
            A lightweight React frontend and optimized backend give you an
            instant, responsive experience.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fa-solid fa-tags" aria-hidden="true"></i>
          </div>
          <h3>Smart Tagging</h3>
          <p>
            Organize with tags so you can always find exactly what you're looking
            for.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
