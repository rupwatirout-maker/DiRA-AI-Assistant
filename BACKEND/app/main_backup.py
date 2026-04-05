from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os
import re
import requests

# ------------------------
# LOAD ENV
# ------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

app = FastAPI()

# ------------------------
# CORS
# ------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# GEMINI CLIENT
# ------------------------
client = genai.Client(api_key=GEMINI_API_KEY)

# ------------------------
# REQUEST MODEL
# ------------------------
class ChatRequest(BaseModel):
    message: str

# ------------------------
# SIMPLE MEMORY
# NOTE:
# This is temporary in-memory memory.
# It resets when server restarts.
# Good for learning and current-session flow.
# ------------------------
conversation_state = {
    "last_topic": "",
    "last_answer_style": "normal",
    "last_format": "normal",
    "awaiting_followup": False,
    "last_response": "",
}

# ------------------------
# HOME
# ------------------------
@app.get("/")
def home():
    return {"message": "DiRA backend is running"}

# ------------------------
# HELPERS
# ------------------------
def detect_format(user_message: str) -> str:
    text = user_message.strip()

    if re.search(r"(^|\n)\s*[A-Da-d]\.", text):
        return "abc"
    if re.search(r"(^|\n)\s*\d+\.", text):
        return "number"
    return "normal"


def detect_length_style(user_message: str) -> str:
    msg = user_message.lower()

    if "very short" in msg:
        return "very_short"
    if "short answer" in msg or "in short" in msg or "briefly" in msg or "brief" in msg:
        return "short"
    if "long answer" in msg or "in detail" in msg or "detailed" in msg or "more details" in msg:
        return "long"
    return "normal"


def build_length_instruction(style: str) -> str:
    if style == "very_short":
        return "Answer in 1 line only."
    if style == "short":
        return "Answer in 2-3 short lines."
    if style == "long":
        return "Explain clearly in detail, step by step."
    return "Answer simply and clearly in 2-4 lines."


def build_format_instruction(fmt: str) -> str:
    if fmt == "number":
        return "If there are multiple questions, answer in numbered format only."
    if fmt == "abc":
        return "If there are multiple questions, answer in A., B., C. format only."
    return "If there are multiple questions, answer clearly point by point."


def sanitize_city(text: str) -> str:
    city = re.sub(r"[^a-zA-Z\s]", "", text)
    city = city.replace("today", "").replace("todays", "").strip()
    return city


def is_emotional_message(msg: str) -> bool:
    emotional_words = [
        "sad", "low", "alone", "upset", "stressed", "stress",
        "anxious", "worried", "panic", "crying", "tired", "broken"
    ]
    return any(word in msg for word in emotional_words)


def emotional_response(msg: str) -> str:
    lower = msg.lower()
    if any(word in lower for word in ["panic", "anxious", "stress", "stressed", "worried"]):
        return (
            "I understand. Please slow down and take one deep breath.\n"
            "You can tell me one thing at a time, and I will stay with you.\n"
            "Do you want to talk more about this?"
        )

    return (
        "I am here with you.\n"
        "Please stay calm and tell me what happened, one step at a time.\n"
        "Do you want to talk more about this?"
    )


def is_followup_request(msg: str) -> bool:
    followups = [
        "yes", "continue", "more", "more details", "explain again",
        "tell more", "go on", "next", "next topic", "done", "ok", "okay"
    ]
    return msg.lower().strip() in followups or any(
        phrase in msg.lower() for phrase in ["explain this again", "continue this", "tell more about this"]
    )


def followup_response(msg: str) -> str:
    lower = msg.lower().strip()

    if lower == "done":
        conversation_state["awaiting_followup"] = False
        return "Okay. We can move to something new."

    if lower in ["yes", "continue", "more", "more details", "explain again", "tell more", "go on", "ok", "okay"] or \
       "continue this" in lower or "explain this again" in lower:
        last_topic = conversation_state.get("last_topic", "")
        if not last_topic:
            return "Please tell me the topic again."
        return generate_ai_response(
            f"Explain more about this topic: {last_topic}",
            followup_mode=True
        )

    if lower == "next" or lower == "next topic":
        conversation_state["awaiting_followup"] = False
        return "Okay. Tell me the next topic."

    return ""


# ------------------------
# REAL COMMAND HANDLER
# ------------------------
def handle_real_commands(user_message: str):
    msg = user_message.lower()

    # WEATHER
    if "weather" in msg:
        if "in" in msg:
            city_text = msg.split("in")[-1]
        elif "of" in msg:
            city_text = msg.split("of")[-1]
        else:
            city_text = msg.split()[-1]

        city = sanitize_city(city_text)

        if not city:
            return "Please tell city like: weather in Kolkata"

        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
        data = requests.get(url).json()

        if data.get("cod") != 200:
            return f"City '{city}' not found."

        temp = data["main"]["temp"]
        condition = data["weather"][0]["description"]

        response = f"Weather in {city.title()}: {temp}°C, {condition.capitalize()}."
        conversation_state["last_topic"] = f"weather in {city.title()}"
        conversation_state["last_response"] = response
        conversation_state["awaiting_followup"] = False
        return response

    # NEWS
    if "news" in msg:
        url = f"https://newsapi.org/v2/top-headlines?country=in&apiKey={NEWS_API_KEY}"
        data = requests.get(url).json()
        articles = data.get("articles", [])

        if not articles:
            return "No news available right now."

        output_lines = ["Top news:"]
        for i, article in enumerate(articles[:3], start=1):
            output_lines.append(f"{i}. {article.get('title')}")

        response = "\n".join(output_lines)
        conversation_state["last_topic"] = "latest news"
        conversation_state["last_response"] = response
        conversation_state["awaiting_followup"] = False
        return response

    # PLAY
    if "play" in msg:
        song = user_message.lower().replace("play", "").strip()
        response = f"Playing {song} on YouTube."
        conversation_state["last_topic"] = song
        conversation_state["last_response"] = response
        conversation_state["awaiting_followup"] = False
        return response

    # DATE
    if "today" in msg and "date" in msg:
        response = datetime.now().strftime("%B %d, %Y")
        conversation_state["last_response"] = response
        conversation_state["awaiting_followup"] = False
        return response

    if "tomorrow" in msg and "date" in msg:
        response = (datetime.now() + timedelta(days=1)).strftime("%B %d, %Y")
        conversation_state["last_response"] = response
        conversation_state["awaiting_followup"] = False
        return response

    if "what day" in msg or "which day" in msg:
        response = datetime.now().strftime("%A")
        conversation_state["last_response"] = response
        conversation_state["awaiting_followup"] = False
        return response

    return None


# ------------------------
# AI RESPONSE
# ------------------------
def generate_ai_response(user_message: str, followup_mode: bool = False) -> str:
    fmt = detect_format(user_message)
    style = detect_length_style(user_message)

    # remember latest detected preferences
    if not followup_mode:
        conversation_state["last_format"] = fmt
        conversation_state["last_answer_style"] = style

    length_instruction = build_length_instruction(
        conversation_state["last_answer_style"] if followup_mode else style
    )
    format_instruction = build_format_instruction(
        conversation_state["last_format"] if followup_mode else fmt
    )

    wants_diagram = "diagram" in user_message.lower() or "flowchart" in user_message.lower()
    diagram_instruction = ""
    if wants_diagram:
        diagram_instruction = "Also include a simple text diagram or text flowchart."

    prompt = f"""
You are DiRA, a calm, friendly, human-like assistant.

STRICT RULES:
- Give a direct and clear answer first.
- Use easy English.
- Match the user's requested style.
- {length_instruction}
- {format_instruction}
- If the user asks only one question, answer only that question.
- Do not add unnecessary points.
- Do not say "As an AI".
- After answering, ask one simple follow-up question like:
  "Did you understand this?"
  or
  "Do you want me to explain more?"
- If user asks for types, examples, or more details, continue the same topic.
- Be warm and human in tone.
- {diagram_instruction}

User: {user_message}

Answer:
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    # save memory
    conversation_state["last_topic"] = user_message
    conversation_state["last_response"] = text
    conversation_state["awaiting_followup"] = True

    return text


# ------------------------
# MAIN CHAT ROUTE
# ------------------------
@app.post("/chat")
def chat(req: ChatRequest):
    try:
        user_message = req.message.strip()

        # 1. follow-up handling
        if is_followup_request(user_message):
            reply = followup_response(user_message)
            if reply:
                return {"response": reply}

        # 2. emotion handling
        if is_emotional_message(user_message):
            response = emotional_response(user_message)
            conversation_state["last_topic"] = "emotional support"
            conversation_state["last_response"] = response
            conversation_state["awaiting_followup"] = True
            return {"response": response}

        # 3. split multiple parts
        parts = [p.strip() for p in re.split(r"[👉\n]+", user_message) if p.strip()]

        responses = []

        for part in parts:
            cmd_response = handle_real_commands(part)

            if cmd_response:
                responses.append(cmd_response)
            else:
                ai_resp = generate_ai_response(part)
                responses.append(ai_resp)

        if not responses:
            return {"response": "I did not understand. Please ask again clearly."}

        return {"response": "\n\n".join(responses)}

    except Exception as e:
        return {"response": f"Error: {str(e)}"}