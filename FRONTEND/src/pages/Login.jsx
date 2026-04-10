import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import {
  hasSavedCredentials,
  isAuthenticated,
  loginUser,
  resetCredentials,
  saveCredentials,
} from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("setup");
  const [setupUsername, setSetupUsername] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
      return;
    }

    if (hasSavedCredentials()) {
      setMode("login");
    } else {
      setMode("setup");
    }
  }, [navigate]);

  const handleSetup = (event) => {
    event.preventDefault();

    if (!setupUsername.trim() || !setupPassword.trim()) {
      setMessage("Please enter both username and password.");
      return;
    }

    saveCredentials(setupUsername, setupPassword);
    navigate("/dashboard");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const success = loginUser(loginUsername, loginPassword);

    if (success) {
      navigate("/dashboard");
    } else {
      setMessage("Invalid username or password.");
    }
  };

  const handleReset = () => {
    resetCredentials();
    setMode("setup");
    setSetupUsername("");
    setSetupPassword("");
    setLoginUsername("");
    setLoginPassword("");
    setMessage("Saved credentials cleared. Set up a new login.");
  };

  return (
    <div className="login-page-shell">
      <button className="login-back-btn" onClick={() => navigate("/")}>
        Back
      </button>

      <div className="login-glow glow-left" />
      <div className="login-glow glow-right" />

      <div className="login-card">
        <p className="login-brand">DiRA</p>
        <h1 className="login-heading">
          {mode === "setup" ? "Create your login" : "Login to continue"}
        </h1>
        <p className="login-subheading">
          {mode === "setup"
            ? "Set a secure username and password for your assistant workspace."
            : "Enter your saved username and password to access your dashboard."}
        </p>

        {mode === "setup" ? (
          <form className="login-form" onSubmit={handleSetup}>
            <label className="login-label" htmlFor="setup-username">
              Username
            </label>
            <input
              id="setup-username"
              className="login-input"
              type="text"
              placeholder="Enter username"
              value={setupUsername}
              onChange={(e) => setSetupUsername(e.target.value)}
            />

            <label className="login-label" htmlFor="setup-password">
              Password
            </label>
            <input
              id="setup-password"
              className="login-input"
              type="password"
              placeholder="Enter password"
              value={setupPassword}
              onChange={(e) => setSetupPassword(e.target.value)}
            />

            <button className="login-submit-btn" type="submit">
              Save and Continue
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <label className="login-label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              className="login-input"
              type="text"
              placeholder="Enter username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />

            <label className="login-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="login-input"
              type="password"
              placeholder="Enter password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button className="login-submit-btn" type="submit">
              Login
            </button>
          </form>
        )}

        <div className="login-footer-actions">
          {mode === "login" && (
            <button className="login-reset-btn" type="button" onClick={handleReset}>
              Reset Credentials
            </button>
          )}
        </div>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;