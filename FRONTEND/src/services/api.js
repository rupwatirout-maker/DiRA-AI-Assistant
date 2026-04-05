const API_URL = "http://127.0.0.1:8000/chat";

export const sendMessage = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    console.log("BACKEND RESPONSE:", data);

    return data;
  } catch (error) {
    console.error("API ERROR:", error);
    return { response: "⚠️ Backend not responding" };
  }
};