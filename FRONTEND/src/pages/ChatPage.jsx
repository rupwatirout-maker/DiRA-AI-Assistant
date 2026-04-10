import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../services/chatService";

function ChatPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(trimmedMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response || "No response received from the assistant.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to the AI service right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="page-layout">
      <div className="top-bar">
        <div className="brand-chip">
          <span className="brand-dot" />
          DiRA AI Chat
        </div>

        <div className="top-actions">
          <button className="secondary-pill-btn" onClick={() => navigate("/dashboard")}>
            Back
          </button>
        </div>
      </div>

      <div className="center-container">
        <div className="glass-panel page-card chat-shell">
          <div className="chat-header">
            <div className="chat-title-block">
              <span className="chat-badge">LIVE ASSISTANT</span>
              <h1 className="section-title">Ask anything</h1>
              <p className="section-subtitle">
                Your chat assistant is connected to the backend. Ask normal questions,
                weather questions, news questions, or anything your configured services support.
              </p>
            </div>
          </div>

          <div className="glass-panel chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty-state">
                <div>
                  Start your conversation with DiRA.
                  <br />
                  Your first message will appear here.
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`message-row ${message.role}`}>
                  <div className="message-bubble">{message.text}</div>
                </div>
              ))
            )}

            {loading && (
              <div className="message-row assistant">
                <div className="message-bubble">DiRA is thinking...</div>
              </div>
            )}
          </div>

          <div className="chat-input-wrap">
            <textarea
              className="chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className="chat-send-btn" onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;