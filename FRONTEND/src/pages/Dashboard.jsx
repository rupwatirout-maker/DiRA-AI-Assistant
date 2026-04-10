import { useNavigate } from "react-router-dom";
import { getSavedUsername, logoutUser } from "../services/authService";

function Dashboard() {
  const navigate = useNavigate();
  const username = getSavedUsername();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="page-layout">
      <div className="top-bar">
        <div className="brand-chip">
          <span className="brand-dot" />
          DiRA Workspace
        </div>

        <div className="top-actions">
          <button className="outline-pill-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="center-container">
        <div className="glass-panel page-card">
          <h1 className="section-title">Welcome, {username}</h1>
          <p className="section-subtitle">
            Choose how you want to use DiRA. Open the AI chat assistant for text-based help
            or launch the voice assistant workspace for hands-free interaction.
          </p>

          <div className="option-grid">
            <div className="option-card">
              <div className="option-label">AI CHAT ASSISTANT</div>
              <h2 className="option-title">Chat with DiRA</h2>
              <p className="option-text">
                Ask questions, get structured answers, and use your connected AI services
                through a focused conversation interface.
              </p>
              <div className="option-footer">
                <button className="primary-pill-btn" onClick={() => navigate("/chat")}>
                  Open Chat
                </button>
              </div>
            </div>

            <div className="option-card voice-card">
              <div className="option-label">VOICE ASSISTANT</div>
              <h2 className="option-title">Use Voice Mode</h2>
              <p className="option-text">
                Prepare your assistant for voice-first interactions, controls, and future
                wake-word based activation flow.
              </p>
              <div className="option-footer">
                <button className="primary-pill-btn" onClick={() => navigate("/voice")}>
                  Open Voice Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;