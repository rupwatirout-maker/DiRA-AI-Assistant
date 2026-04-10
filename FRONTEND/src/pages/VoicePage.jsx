import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VoicePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Standby");

  return (
    <div className="page-layout">
      <div className="top-bar">
        <div className="brand-chip">
          <span className="brand-dot" />
          DiRA Voice Assistant
        </div>

        <div className="top-actions">
          <button className="secondary-pill-btn" onClick={() => navigate("/dashboard")}>
            Back
          </button>
        </div>
      </div>

      <div className="center-container">
        <div className="glass-panel page-card">
          <div className="voice-header">
            <div className="voice-title-block">
              <span className="voice-badge">VOICE WORKSPACE</span>
              <h1 className="section-title">Voice Assistant Control</h1>
              <p className="section-subtitle">
                This page is ready for your voice interface flow. You can later connect voice
                input, wake-word activation, avatar settings, and voice profiles here.
              </p>
            </div>
          </div>

          <div className="voice-grid">
            <div className="voice-panel voice-status-card">
              <div>
                <div className="voice-status-orb" />
                <h2 className="voice-status-title">{status}</h2>
                <p className="voice-status-text">
                  This is the dedicated voice workspace for your hybrid assistant. Keep this
                  page as the base for future activation flow such as custom wake word and
                  shutdown command support.
                </p>
              </div>

              <div className="voice-controls">
                <button
                  className="voice-control-btn start"
                  onClick={() => setStatus("Listening")}
                >
                  Start Listening
                </button>

                <button
                  className="voice-control-btn stop"
                  onClick={() => setStatus("Standby")}
                >
                  Stop
                </button>
              </div>
            </div>

            <div className="voice-panel">
              <div className="voice-list">
                <div className="voice-list-item">
                  <h4>Wake Word Ready</h4>
                  <p>
                    This section can later be extended for custom activation words such as
                    Lisa, Nova, or any name you want for the assistant.
                  </p>
                </div>

                <div className="voice-list-item">
                  <h4>Voice Personality</h4>
                  <p>
                    Add voice selection, avatar style, speech speed, and response tone controls
                    here as the next upgrade step.
                  </p>
                </div>

                <div className="voice-list-item">
                  <h4>Shutdown Command</h4>
                  <p>
                    This layout is already suitable for adding a voice-based shutdown flow for
                    future hands-free assistant use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoicePage;