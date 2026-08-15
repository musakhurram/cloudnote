import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      const json = await response.json();
      console.log(json);
      if (json.success && json.authToken) {
        localStorage.setItem("token", json.authToken);
        props.showAlert("Logged In successfully", "success");
        navigate("/");
      } else if (json.authToken) {
        localStorage.setItem("token", json.authToken);
        props.showAlert("Logged In successfully", "success");
        navigate("/");
      } else {
        props.showAlert("Invalid credentials", "danger");
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
      <div className="auth-card">
        <div className="auth-tag">Secure Access</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to access your cloud notes.</p>

        <form onSubmit={HandleSubmit}>
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
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            <i className="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
