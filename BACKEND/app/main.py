from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv
import os
import re

# ------------------------
# LOAD ENV
# ------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ------------------------
# FASTAPI
# ------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=GEMINI_API_KEY)

# ------------------------
# REQUEST MODEL
# ------------------------
class ChatRequest(BaseModel):
    message: str

# ------------------------
# MEMORY
# ------------------------
memory = {
    "last_topic": "",
    "last_reply": ""
}

# ------------------------
# HOME
# ------------------------
@app.get("/")
def home():
    return {"message": "DiRA backend running"}

# ------------------------
# DETECT FORMAT
# ------------------------
def detect_format(msg):
    if re.search(r"\d+\.", msg):
        return "number"
    if re.search(r"[A-Za-z]\.", msg):
        return "abc"
    if re.search(r"\b(i|ii|iii|iv|v|vi|vii|viii|ix|x)\b", msg.lower()):
        return "roman"
    return "normal"

# ------------------------
# DETECT STYLE
# ------------------------
def detect_style(msg):
    m = msg.lower()

    if "very short" in m:
        return "very_short"
    if "short" in m or "brief" in m:
        return "short"
    if "easy" in m or "simple" in m:
        return "easy"
    if "detail" in m or "long" in m:
        return "long"
    if "step" in m or "point" in m:
        return "steps"

    return "normal"

# ------------------------
# EMOTION DETECTION
# ------------------------
def detect_emotion(msg):
    m = msg.lower()

    if any(w in m for w in ["sad", "upset", "low", "alone"]):
        return "sad"
    if any(w in m for w in ["happy", "excited"]):
        return "happy"
    if any(w in m for w in ["stress", "tired", "pressure"]):
        return "stress"

    return "normal"

# ------------------------
# FOLLOW-UP HANDLING
# ------------------------
def handle_followup(msg):
    m = msg.lower().strip()

    if m in ["yes", "continue", "more", "again", "next"]:
        if memory["last_topic"]:
            return f"Continue this topic: {memory['last_topic']}"
    if m in ["easy way", "simple way"]:
        return f"Explain this in easy way: {memory['last_topic']}"

    return msg

# ------------------------
# GENERATE RESPONSE
# ------------------------
def generate_reply(user_message):

    user_message = handle_followup(user_message)

    fmt = detect_format(user_message)
    style = detect_style(user_message)
    emotion = detect_emotion(user_message)

    # STYLE RULE
    style_rule = {
        "very_short": "Answer in 1 line only.",
        "short": "Answer in 2 lines max.",
        "easy": "Explain in very simple words.",
        "long": "Explain clearly in detail.",
        "steps": "Answer in step-by-step or point format.",
        "normal": "Answer in 2-3 simple lines."
    }[style]

    # FORMAT RULE
    format_rule = {
        "number": "Answer in same numbered format (1,2,3).",
        "abc": "Answer in same ABC format.",
        "roman": "Answer in same Roman format.",
        "normal": "Use normal format."
    }[fmt]

    # EMOTION RULE
    emotion_rule = ""

    if emotion == "sad":
        emotion_rule = "User is sad. Talk calmly and supportively. Keep it short."
    elif emotion == "happy":
        emotion_rule = "User is happy. Respond positively but do not over-talk."
    elif emotion == "stress":
        emotion_rule = "User is stressed. Calm them in 1-2 lines."

    # ------------------------
    # FINAL PROMPT
    # ------------------------
    prompt = f"""
You are DiRA, a smart AI assistant.

STRICT RULES:
- DO NOT write long paragraphs
- DO NOT add introduction
- Answer ONLY what user asked
- Keep it clean, human, simple
- Max 2-3 lines per answer unless asked
- Support multi-language automatically (Hindi, English, Bengali, Tamil, etc.)
- Accept emojis, roman numbers, mixed language

STYLE:
{style_rule}

FORMAT:
{format_rule}

EMOTION:
{emotion_rule}

BEHAVIOR:
- First answer
- Then ask ONE small question like:
  "Did you understand?" or "Want more?"

User: {user_message}

Answer:
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        reply = response.text.strip()

    except Exception as e:
        if "429" in str(e):
            reply = "⚠️ API limit reached. Try after some time."
        else:
            reply = "⚠️ Error occurred."

    memory["last_topic"] = user_message
    memory["last_reply"] = reply

    return reply

# ------------------------
# CHAT ROUTE
# ------------------------
@app.post("/chat")
def chat(req: ChatRequest):
    user_message = req.message.strip()

    if not user_message:
        return {"response": "Type something."}

    reply = generate_reply(user_message)

    return {"response": reply}