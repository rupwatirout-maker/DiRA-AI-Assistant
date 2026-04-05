import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim() === "") {
      alert("Enter your username");
      return;
    }

    localStorage.setItem("dira_user", username);
    alert(`Welcome ${username}`);
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login to DiRA</h1>

      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="login-input"
      />

      <button className="login-btn-main" onClick={handleLogin}>
        Start
      </button>
    </div>
  );
}

export default Login;