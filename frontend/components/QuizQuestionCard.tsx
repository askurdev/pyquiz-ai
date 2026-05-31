"use client";
import { useState } from "react";
import { QuizQuestion, EvaluationResponse, evaluateAnswer } from "@/lib/api";

interface Props {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: (result: { correct: boolean; score: number }) => void;
}

export default function QuizQuestionCard({ question, questionNumber, totalQuestions, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const handleSelect = async (option: string) => {
    if (selected || evaluating) return;
    setSelected(option);
    setEvaluating(true);
    try {
      const result = await evaluateAnswer(
        question.question,
        question.correct_answer,
        option,
        question.explanation
      );
      setEvaluation(result);
    } catch {
      // Fallback evaluation
      const isCorrect = option === question.correct_answer;
      setEvaluation({
        is_correct: isCorrect,
        score: isCorrect ? 10 : 0,
        feedback: isCorrect ? "Correct! Well done." : "Not quite. Review this concept.",
        explanation: question.explanation,
        tip: "Keep practicing!",
      });
    } finally {
      setEvaluating(false);
    }
  };

  const getOptionClass = (option: string) => {
    if (!selected) return "option-btn";
    if (option === question.correct_answer) return "option-btn correct";
    if (option === selected && option !== question.correct_answer) return "option-btn wrong";
    return "option-btn";
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="fade-up" style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="tag tag-purple">{question.topic}</span>
          <span className={`tag tag-${question.difficulty === 'beginner' ? 'green' : question.difficulty === 'intermediate' ? 'orange' : 'purple'}`}>
            {question.difficulty}
          </span>
        </div>
        <span className="mono" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 28 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: "2rem", marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: "0.7rem", color: "var(--accent)", marginBottom: 12, letterSpacing: "0.1em" }}>
          QUESTION {questionNumber.toString().padStart(2, "0")}
        </div>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.6, fontWeight: 600 }}>
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {question.options.map((option, i) => (
          <button
            key={i}
            className={getOptionClass(option)}
            onClick={() => handleSelect(option)}
            disabled={!!selected || evaluating}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <span className="mono" style={{
              minWidth: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              flexShrink: 0,
            }}>
              {String.fromCharCode(65 + i)}
            </span>
            <span>{option}</span>
          </button>
        ))}
      </div>

      {/* Evaluating spinner */}
      {evaluating && (
        <div className="mono" style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", padding: "12px" }}>
          ⚡ AI is evaluating your answer...
        </div>
      )}

      {/* Evaluation Result */}
      {evaluation && (
        <div
          className="card fade-up"
          style={{
            padding: "1.5rem",
            borderColor: evaluation.is_correct ? "var(--correct)" : "var(--wrong)",
            background: evaluation.is_correct
              ? "rgba(0,255,136,0.05)"
              : "rgba(255,71,87,0.05)",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: "1.5rem" }}>{evaluation.is_correct ? "✓" : "✗"}</span>
            <span style={{
              fontWeight: 700,
              color: evaluation.is_correct ? "var(--correct)" : "var(--wrong)",
              fontSize: "1rem",
            }}>
              {evaluation.is_correct ? "CORRECT!" : "INCORRECT"}
            </span>
            {evaluation.is_correct && (
              <span className="tag tag-green mono" style={{ marginLeft: "auto", fontSize: "0.65rem" }}>
                +10 pts
              </span>
            )}
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 12 }}>
            {evaluation.feedback}
          </p>

          <div style={{
            background: "var(--surface2)",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 10,
            borderLeft: "3px solid var(--accent2)",
          }}>
            <div className="mono" style={{ fontSize: "0.65rem", color: "var(--accent2)", marginBottom: 4, letterSpacing: "0.08em" }}>
              EXPLANATION
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.6 }}>
              {evaluation.explanation}
            </p>
          </div>

          <div style={{
            background: "var(--surface2)",
            borderRadius: 8,
            padding: "10px 14px",
            borderLeft: "3px solid var(--accent3)",
          }}>
            <div className="mono" style={{ fontSize: "0.65rem", color: "var(--accent3)", marginBottom: 4, letterSpacing: "0.08em" }}>
              💡 PRO TIP
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {evaluation.tip}
            </p>
          </div>
        </div>
      )}

      {/* Next Button */}
      {evaluation && (
        <button
          className="btn-primary fade-up"
          onClick={() => onNext({ correct: evaluation.is_correct, score: evaluation.score })}
          style={{ width: "100%", padding: "14px", fontSize: "0.9rem" }}
        >
          {questionNumber === totalQuestions ? "SEE RESULTS →" : "NEXT QUESTION →"}
        </button>
      )}
    </div>
  );
}
