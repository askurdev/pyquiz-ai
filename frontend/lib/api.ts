const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  topic: string;
  difficulty: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  topic: string;
  difficulty: string;
}

export interface EvaluationResponse {
  is_correct: boolean;
  score: number;
  feedback: string;
  explanation: string;
  tip: string;
}

export interface GenerateQuizRequest {
  topic: string;
  difficulty: string;
  num_questions: number;
}

export async function generateQuiz(req: GenerateQuizRequest): Promise<QuizResponse> {
  const res = await fetch(`${API_BASE}/generate-quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to generate quiz");
  }
  return res.json();
}

export async function evaluateAnswer(
  question: string,
  correct_answer: string,
  user_answer: string,
  explanation: string
): Promise<EvaluationResponse> {
  const res = await fetch(`${API_BASE}/evaluate-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, correct_answer, user_answer, explanation }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to evaluate answer");
  }
  return res.json();
}

export async function getTopics(): Promise<{ topics: string[]; difficulties: string[] }> {
  const res = await fetch(`${API_BASE}/topics`);
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
}
