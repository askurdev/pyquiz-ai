from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-3.5-flash")

app = FastAPI(title="Python Quiz AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"]
TOPICS = [
    "variables & data types",
    "functions",
    "loops & conditionals",
    "lists & dictionaries",
    "OOP & classes",
    "error handling",
    "file I/O",
    "decorators",
    "generators",
    "async/await",
]


class GenerateQuizRequest(BaseModel):
    topic: str = "general Python"
    difficulty: str = "intermediate"
    num_questions: int = 5


class EvaluateAnswerRequest(BaseModel):
    question: str
    correct_answer: str
    user_answer: str
    explanation: str


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: list[str]
    correct_answer: str
    explanation: str
    topic: str
    difficulty: str


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]
    topic: str
    difficulty: str


class EvaluationResponse(BaseModel):
    is_correct: bool
    score: int
    feedback: str
    explanation: str
    tip: str


@app.get("/")
def root():
    return {"message": "Python Quiz AI Backend is running! (Powered by Gemini)"}


@app.get("/topics")
def get_topics():
    return {"topics": TOPICS, "difficulties": DIFFICULTY_LEVELS}


@app.post("/generate-quiz", response_model=QuizResponse)
def generate_quiz(req: GenerateQuizRequest):
    if req.num_questions < 1 or req.num_questions > 10:
        raise HTTPException(status_code=400, detail="num_questions must be between 1 and 10")

    prompt = f"""Generate {req.num_questions} multiple-choice Python quiz questions about "{req.topic}" at {req.difficulty} level.

Return ONLY valid JSON in this exact format, no markdown, no extra text:
{{
  "questions": [
    {{
      "id": 1,
      "question": "What does this Python code output: print(type([]))?",
      "options": ["<class 'list'>", "<class 'array'>", "list", "Array"],
      "correct_answer": "<class 'list'>",
      "explanation": "type([]) returns the type of an empty list, which is <class 'list'>",
      "topic": "{req.topic}",
      "difficulty": "{req.difficulty}"
    }}
  ]
}}

Rules:
- Each question must have exactly 4 options
- correct_answer must be exactly one of the options
- Questions should be practical and test real Python knowledge
- For {req.difficulty} level: {"focus on syntax basics" if req.difficulty == "beginner" else "include real-world scenarios" if req.difficulty == "intermediate" else "cover advanced concepts and edge cases"}
- Make sure explanations are educational and helpful
- Return ONLY the JSON, no markdown backticks, no extra words"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        response_text = re.sub(r"^```(?:json)?\s*", "", response_text)
        response_text = re.sub(r"\s*```$", "", response_text)

        data = json.loads(response_text)
        questions = [QuizQuestion(**q) for q in data["questions"]]
        return QuizResponse(questions=questions, topic=req.topic, difficulty=req.difficulty)
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")


@app.post("/evaluate-answer", response_model=EvaluationResponse)
def evaluate_answer(req: EvaluateAnswerRequest):
    is_correct = req.user_answer.strip().lower() == req.correct_answer.strip().lower()
    score = 10 if is_correct else 0

    prompt = f"""A student answered a Python quiz question. Give them encouraging, educational feedback.

Question: {req.question}
Correct Answer: {req.correct_answer}
Student's Answer: {req.user_answer}
Is Correct: {is_correct}
Explanation: {req.explanation}

Return ONLY valid JSON, no markdown, no extra text:
{{
  "feedback": "2-3 sentence personalized feedback acknowledging their answer",
  "tip": "One practical Python tip related to this concept they can remember"
}}"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        response_text = re.sub(r"^```(?:json)?\s*", "", response_text)
        response_text = re.sub(r"\s*```$", "", response_text)

        ai_data = json.loads(response_text)
        return EvaluationResponse(
            is_correct=is_correct,
            score=score,
            feedback=ai_data["feedback"],
            explanation=req.explanation,
            tip=ai_data["tip"],
        )
    except Exception:
        return EvaluationResponse(
            is_correct=is_correct,
            score=score,
            feedback="দারুণ চেষ্টা! Python practice চালিয়ে যাও।" if is_correct else "এবার হয়নি — এই concept টা আবার দেখো!",
            explanation=req.explanation,
            tip="Practice makes perfect with Python!",
        )
