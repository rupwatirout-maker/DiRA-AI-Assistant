import "./App.css";

function App() {
  return (
    <div className="main">

      {/* Login */}
      <div className="top-bar">
        <button className="login-btn">Login</button>
      </div>

      {/* Center */}
      <div className="center">

        {/* LOGO */}
        <div className="logo">

          <svg viewBox="0 0 200 200" width="180">

            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4ecd" />
                <stop offset="100%" stopColor="#4ecbff" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* D (smooth curve) */}
            <path
              d="M55 40 L55 160 
                 Q120 150 120 100 
                 Q120 50 55 40 Z"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* R (clean modern) */}
            <path
              d="M110 40 L110 160 
                 M110 40 
                 Q165 50 155 95 
                 Q145 130 110 110 
                 L155 160"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
            />

          </svg>

        </div>

        {/* TEXT */}
        <h1 className="title">DiRA</h1>

        <p className="subtitle">
          too many thoughts? i got you.
        </p>

        <p className="credit">
          by Rupwati Rout
        </p>

      </div>
    </div>
  );
}

export default App;