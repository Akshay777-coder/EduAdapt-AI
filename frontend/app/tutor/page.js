"use client";
import { useState } from 'react';

export default function Tutor() {
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState("beginner");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askTutor = async () => {
    setLoading(true);
    setError(null);
    setAnswer("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutor/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, level })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Tutor</h2>
      <div className="card">
        <label>Your Level</label>
        <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <label>Ask anything...</label>
        <textarea className="textarea" rows="4" value={question} onChange={(e) => setQuestion(e.target.value)}></textarea>
        <button className="btn" onClick={askTutor} disabled={loading || !question}>
          {loading ? "EduAdapt AI is thinking..." : "Ask EduAdapt AI"}
        </button>
      </div>
      {error && <div className="error-msg">{error}</div>}
      {answer && (
        <div className="card pre-wrap">
          <h3>Answer:</h3>
          {answer}
        </div>
      )}
    </div>
  );
}
