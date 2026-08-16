import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";
import API_URL from "../../config";

const Signup = (props) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;
    if (password !== cpassword) {
      props.showAlert("Passwords do not match", "danger");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      console.log(json);
      if (json.success && json.authToken) {
        localStorage.setItem("token", json.authToken);
        props.showAlert("Account created successfully", "success");
        navigate("/");
      } else {
        props.showAlert("Invalid details", "danger");
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-showcase">
        <span className="auth-showcase-brand">
          <i className="fa-solid fa-cloud" aria-hidden="true"></i>
          Cloud<span className="brand-accent">Note</span>
        </span>
        <div className="auth-showcase-quote">
          <p>"Start with an empty page. See how quickly it fills up."</p>
          <span>Free to join — your first note takes less than a minute.</span>
        </div>
        <div className="auth-showcase-card">
          <div className="auth-showcase-card-title">Reading list</div>
          <div className="auth-showcase-card-line"></div>
          <div className="auth-showcase-card-line"></div>
          <span className="note-tag">
            <i className="fa-solid fa-tag" aria-hidden="true"></i>
            Personal
          </span>
        </div>
      </div>

      <div className="auth-panel">
      <div className="auth-card">
        <div className="auth-tag">Join CloudNote</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Your notes, synced across every device.</p>

        <form onSubmit={HandleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <div className="input-with-icon">
              <i className="fa-solid fa-user input-icon" aria-hidden="true"></i>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Your name"
                value={credentials.name}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <div className="input-with-icon">
              <i className="fa-solid fa-envelope input-icon" aria-hidden="true"></i>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                aria-describedby="emailHelp"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={onChange}
              />
            </div>
            <small id="emailHelp" className="form-hint">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-with-icon">
              <i className="fa-solid fa-lock input-icon" aria-hidden="true"></i>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={onChange}
                minLength={5}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="cpassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-with-icon">
              <i className="fa-solid fa-lock input-icon" aria-hidden="true"></i>
              <input
                type="password"
                className="form-control"
                id="cpassword"
                name="cpassword"
                placeholder="••••••••"
                value={credentials.cpassword}
                onChange={onChange}
                minLength={5}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            <i className="fa-solid fa-user-plus" aria-hidden="true"></i>
            Create Account
          </button>
        </form>

        <GoogleSignIn showAlert={props.showAlert} mode="signup" />

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Signup;
