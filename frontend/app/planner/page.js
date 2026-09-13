"use client";
import { useState } from 'react';

export default function Planner() {
  const [form, setForm] = useState({ subject: "Python", level: "beginner", daily_hours: 2, exam_date: "2026-10-10" });
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-plan/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setPlan(data.plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Study Planner</h2>
      <div className="card">
        <div className="grid-2">
          <div>
            <label>Subject</label>
            <input className="input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
          </div>
          <div>
            <label>Level</label>
            <select className="select" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label>Daily Hours</label>
            <input type="number" className="input" value={form.daily_hours} onChange={e => setForm({...form, daily_hours: e.target.value})} />
          </div>
          <div>
            <label>Exam Date</label>
            <input type="date" className="input" value={form.exam_date} onChange={e => setForm({...form, exam_date: e.target.value})} />
          </div>
        </div>
        <button className="btn" onClick={generatePlan} disabled={loading}>
          {loading ? "Generating..." : "Generate Study Plan"}
        </button>
      </div>
      {error && <div className="error-msg">{error}</div>}
      {plan && (
        <div className="card pre-wrap">
          <h3>Your Study Plan</h3>
          {plan}
        </div>
      )}
    </div>
  );
}
