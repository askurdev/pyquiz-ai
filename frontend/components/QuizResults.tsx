"use client";

interface Props {
  score: number;
  totalQuestions: number;
  topic: string;
  difficulty: string;
  onRestart: () => void;
}

export default function QuizResults({ score, totalQuestions, topic, difficulty, onRestart }: Props) {
  const maxScore = totalQuestions * 10;
  const percentage = Math.round((score / maxScore) * 100);
  const correct = score / 10;

  const getRank = () => {
    if (percentage >= 90) return { label: "PYTHON MASTER", color: "var(--accent)", emoji: "🏆" };
    if (percentage >= 70) return { label: "SKILLED CODER", color: "#a78bfa", emoji: "⚡" };
    if (percentage >= 50) return { label: "LEARNING FAST", color: "var(--accent3)", emoji: "📈" };
    return { label: "KEEP PRACTICING", color: "var(--text-muted)", emoji: "💪" };
  };

  const rank = getRank();
  const circumference = 283;
  const offset = circumference - (circumference * percentage) / 100;

  return (
    <div className="fade-up" style={{ maxWidth: 520, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
      <div className="mono" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 24, letterSpacing: "0.12em" }}>
        QUIZ COMPLETE
      </div>

      {/* Score Ring */}
      <div style={{ position: "relative", display: "inline-block", marginBottom: 28 }}>
        <svg width={120} height={120} viewBox="0 0 120 120">
          <circle cx={60} cy={60} r={45} fill="none" stroke="var(--border)" strokeWidth={6} />
          <circle
            cx={60} cy={60} r={45}
            fill="none"
            stroke={rank.color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: rank.color, lineHeight: 1 }}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Rank Badge */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>{rank.emoji}</div>
        <div style={{
          fontWeight: 800,
          fontSize: "1.5rem",
          color: rank.color,
          letterSpacing: "0.05em",
          marginBottom: 8,
        }}>
          {rank.label}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {correct} / {totalQuestions} questions correct
        </p>
      </div>

      {/* Stats Grid */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "SCORE", value: `${score}`, unit: `/ ${maxScore}` },
            { label: "TOPIC", value: topic.split(" ")[0].toUpperCase(), unit: "" },
            { label: "LEVEL", value: difficulty.slice(0, 3).toUpperCase(), unit: "" },
          ].map(({ label, value, unit }) => (
            <div key={label}>
              <div className="mono" style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.1em" }}>
                {label}
              </div>
              <div className="mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)" }}>
                {value}<span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message */}
      <div style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "14px 18px",
        marginBottom: 24,
        borderLeft: "3px solid var(--accent)",
        textAlign: "left",
      }}>
        <p className="mono" style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {percentage >= 90
            ? "🎉 Outstanding! You clearly know your Python. Ready for a harder challenge?"
            : percentage >= 70
            ? "💪 Great work! You have a solid grasp. A bit more practice will make you a master."
            : percentage >= 50
            ? "📚 Decent effort! Review the topics you missed and try again to level up."
            : "🔄 Python takes time to master. Focus on the fundamentals and keep going!"}
        </p>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          className="btn-outline"
          onClick={onRestart}
          style={{ flex: 1, padding: "13px", fontSize: "0.85rem" }}
        >
          NEW QUIZ
        </button>
        <button
          className="btn-primary"
          onClick={onRestart}
          style={{ flex: 1, padding: "13px", fontSize: "0.85rem" }}
        >
          TRY AGAIN →
        </button>
      </div>
    </div>
  );
}
