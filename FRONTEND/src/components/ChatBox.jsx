import { useState } from "react";
import { sendMessage } from "../services/api";

function ChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);

    const data = await sendMessage(message);

    setChat([
      ...newChat,
      { sender: "bot", text: data.response || "No response" },
    ]);

    setMessage("");
  };

  return (
    <div className="p-4 h-screen flex flex-col bg-black text-white">
      <h2 className="text-xl mb-4 text-center font-bold">DiRA AI Assistant</h2>

      <div className="flex-1 overflow-y-auto mb-4 px-2 space-y-3">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-lg whitespace-pre-wrap ${
              msg.sender === "user"
                ? "bg-green-500 ml-auto text-right"
                : "bg-gray-700 text-left"
            }`}
          >
            {msg.text.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 text-black rounded-l outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="bg-green-500 px-4 rounded-r hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;