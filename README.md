# 🐍 PyQuiz.AI — Python Quiz with AI Backend

A full-stack Python quiz application with:
- **Backend**: FastAPI + Anthropic AI (generates questions & evaluates answers)
- **Frontend**: Next.js 15 with a sleek dark terminal aesthetic

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_api_key_here
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

### 2. Frontend Setup

```bash
cd frontend
npm install
# Edit .env.local if backend is on different port
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 🏗 Architecture

```
pyquiz-ai/
├── backend/
│   ├── main.py          # FastAPI app with AI endpoints
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── page.tsx     # Main quiz orchestrator
    │   └── layout.tsx
    ├── components/
    │   ├── QuizSetup.tsx        # Topic/difficulty selector
    │   ├── QuizQuestionCard.tsx # Question + answer UI
    │   └── QuizResults.tsx      # Score & rank display
    └── lib/
        └── api.ts       # API client functions
```

## 🤖 AI Features

| Feature | How it works |
|---|---|
| Question generation | Claude generates fresh MCQs every time |
| Answer evaluation | Claude gives personalized feedback |
| Pro tips | AI suggests learning tips per question |
| Dynamic difficulty | Beginner/Intermediate/Advanced prompting |

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/topics` | Available topics & difficulties |
| POST | `/generate-quiz` | Generate AI quiz questions |
| POST | `/evaluate-answer` | Evaluate student's answer |

## 🎨 Features

- 10 Python topics to choose from
- 3 difficulty levels
- 3–10 configurable questions
- Instant AI feedback after each answer
- Score tracking with percentage ranking
- Beautiful dark terminal UI
