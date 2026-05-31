"use client";
import { useState } from "react";
import QuizSetup from "@/components/QuizSetup";
import QuizQuestionCard from "@/components/QuizQuestionCard";
import QuizResults from "@/components/QuizResults";
import { generateQuiz, GenerateQuizRequest, QuizQuestion } from "@/lib/api";

type Phase = "setup" | "quiz" | "results";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [quizMeta, setQuizMeta] = useState({ topic: "", difficulty: "" });

  const handleStart = async (req: GenerateQuizRequest) => {
    setLoading(true);
    setError(null);
    try {
      const quiz = await generateQuiz(req);
      setQuestions(quiz.questions);
      setQuizMeta({ topic: quiz.topic, difficulty: quiz.difficulty });
      setCurrentIndex(0);
      setTotalScore(0);
      setPhase("quiz");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate quiz. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = ({ correct, score }: { correct: boolean; score: number }) => {
    const newScore = totalScore + score;
    setTotalScore(newScore);
    if (currentIndex + 1 >= questions.length) {
      setPhase("results");
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleRestart = () => {
    setPhase("setup");
    setError(null);
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* Navbar */}
      <nav style={{
        borderBottom: "1px solid var(--border)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10,10,15,0.85)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.4rem" }}>🐍</span>
          <span className="mono" style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--accent)" }}>
            PYQUIZ.AI
          </span>
        </div>
        {phase !== "setup" && (
          <button
            className="btn-outline"
            onClick={handleRestart}
            style={{ padding: "6px 16px", fontSize: "0.75rem" }}
          >
            ← HOME
          </button>
        )}
        {phase === "quiz" && (
          <span className="mono" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Q{currentIndex + 1}/{questions.length} · {totalScore}pts
          </span>
        )}
      </nav>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: "rgba(255,71,87,0.1)",
          border: "1px solid rgba(255,71,87,0.3)",
          borderRadius: 8,
          padding: "12px 20px",
          margin: "20px auto",
          maxWidth: 600,
          textAlign: "center",
          color: "var(--wrong)",
          fontSize: "0.85rem",
        }} className="mono">
          ⚠ {error}
        </div>
      )}

      {/* Phases */}
      {phase === "setup" && (
        <QuizSetup onStart={handleStart} loading={loading} />
      )}

      {phase === "quiz" && questions.length > 0 && (
        <QuizQuestionCard
          key={currentIndex}
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onNext={handleNext}
        />
      )}

      {phase === "results" && (
        <QuizResults
          score={totalScore}
          totalQuestions={questions.length}
          topic={quizMeta.topic}
          difficulty={quizMeta.difficulty}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
