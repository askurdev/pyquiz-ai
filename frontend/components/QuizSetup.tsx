"use client";
import { useState } from "react";
import { GenerateQuizRequest } from "@/lib/api";

const TOPICS = [
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
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "tag-green",
  intermediate: "tag-orange",
  advanced: "tag-purple",
};

interface Props {
  onStart: (req: GenerateQuizRequest) => void;
  loading: boolean;
}

export default function QuizSetup({ onStart, loading }: Props) {
  const [topic, setTopic] = useState("functions");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [numQuestions, setNumQuestions] = useState(5);

  return (
    <div className="fade-up" style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <span className="tag tag-green">AI Powered</span>
          <span className="tag tag-purple">Python</span>
          <span className="tag tag-orange">Quiz</span>
        </div>
        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}>
          Test Your<br />
          <span style={{ color: "var(--accent)" }}>Python Skills</span>
        </h1>
        <p className="mono" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          {'>>> AI-generated questions, instant feedback'}
        </p>
      </div>

      {/* Config Card */}
      <div className="card" style={{ padding: "2rem" }}>
        {/* Topic */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label className="mono" style={{ display: "block", fontSize: "0.75rem", color: "var(--accent)", marginBottom: 10, letterSpacing: "0.1em" }}>
            01 / TOPIC
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={topic}
              onChange={e => setTopic(e.target.value)}
              style={{ width: "100%", padding: "12px 40px 12px 14px" }}
            >
              {TOPICS.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>▾</span>
          </div>
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label className="mono" style={{ display: "block", fontSize: "0.75rem", color: "var(--accent)", marginBottom: 10, letterSpacing: "0.1em" }}>
            02 / DIFFICULTY
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={difficulty === d ? `tag ${DIFFICULTY_COLORS[d]}` : "tag"}
                style={{
                  flex: 1,
                  padding: "10px",
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  background: difficulty === d ? undefined : "var(--surface2)",
                  border: difficulty === d ? undefined : "1px solid var(--border)",
                  color: difficulty === d ? undefined : "var(--text-muted)",
                  transition: "all 0.2s",
                }}
              >
                {d.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div style={{ marginBottom: "2rem" }}>
          <label className="mono" style={{ display: "block", fontSize: "0.75rem", color: "var(--accent)", marginBottom: 10, letterSpacing: "0.1em" }}>
            03 / QUESTIONS — <span style={{ color: "var(--text)" }}>{numQuestions}</span>
          </label>
          <input
            type="range"
            min={3}
            max={10}
            value={numQuestions}
            onChange={e => setNumQuestions(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--accent)",
              cursor: "pointer",
              height: 4,
            }}
          />
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 6 }}>
            <span>3</span><span>10</span>
          </div>
        </div>

        <button
          className="btn-primary"
          disabled={loading}
          onClick={() => onStart({ topic, difficulty, num_questions: numQuestions })}
          style={{ width: "100%", padding: "14px", fontSize: "0.9rem" }}
        >
          {loading ? (
            <span>⚡ GENERATING QUIZ...</span>
          ) : (
            <span>START QUIZ →</span>
          )}
        </button>
      </div>

      {/* Footer hint */}
      <p className="mono" style={{ textAlign: "center", marginTop: 24, fontSize: "0.72rem", color: "var(--text-muted)" }}>
        Questions are AI-generated fresh every time
      </p>
    </div>
  );
}
