import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <button className="home-login-btn" onClick={() => navigate("/login")}>
        Login
      </button>

      <div className="home-hero">
        <div className="home-badge">HYBRID AI ASSISTANT</div>

        <h1 className="home-logo">
          <span className="letter d">D</span>
          <span className="letter i">i</span>
          <span className="letter r">R</span>
          <span className="letter a">A</span>
        </h1>

        <p className="home-tagline">
          Your intelligent hybrid assistant for text, voice, and real-time help.
        </p>

        <p className="home-subtitle">
          Talk when your hands are busy. Type when privacy matters.
        </p>

        <div className="home-cta-row">
          <button className="home-primary-btn" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>

        <div className="home-feature-grid">
          <div className="home-feature-card">
            <span className="home-feature-label">TEXT MODE</span>
            <h3>AI Chat Assistant</h3>
            <p>
              Ask questions, get structured answers, and interact with your connected AI
              services through a focused chat experience.
            </p>
          </div>

          <div className="home-feature-card">
            <span className="home-feature-label">VOICE MODE</span>
            <h3>Hands-Free Assistant</h3>
            <p>
              Prepare your assistant for wake-word activation, voice control, and future
              real-world usage when typing is not possible.
            </p>
          </div>

          <div className="home-feature-card">
            <span className="home-feature-label">LIVE SERVICES</span>
            <h3>Connected APIs</h3>
            <p>
              Your project is designed to work with AI, weather, news, and other connected
              services through the backend you already built.
            </p>
          </div>
        </div>

        <p className="home-powered">
          Powered by <span>Rupwati Rout</span>
        </p>
      </div>
    </div>
  );
}

export default Home;