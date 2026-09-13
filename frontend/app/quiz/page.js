"use client";
import { useState } from 'react';

export default function Quiz() {
  const [subject, setSubject] = useState("Python");
  const [topic, setTopic] = useState("Lists");
  const [level, setLevel] = useState("beginner");
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [result, setResult] = useState(null);
  const [recommendation, setRecommendation] = useState("");

  const generateQuiz = async () => {
    setLoading(true); setError(null); setQuestions([]); setResult(null); setRecommendation("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, level })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setQuestions(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const userAnswers = questions.map((q, i) => answers[i] || "");
      const correctAnswers = questions.map(q => q.answer);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, answers: userAnswers, correct_answers: correctAnswers })
      });
      const resultData = await res.json();
      setResult(resultData);

      // Save to local storage for dashboard
      let profile = JSON.parse(localStorage.getItem('eduProfile') || '{}');
      profile.lastScore = `${resultData.score}/${resultData.total} (${resultData.percentage}%)`;
      localStorage.setItem('eduProfile', JSON.stringify(profile));

      // Get recommendation
      const recRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommend/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, score: resultData.score })
      });
      const recData = await recRes.json();
      setRecommendation(recData.recommendation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Adaptive Quiz</h2>
      
      {!questions.length && !result && (
        <div className="card">
          <div className="grid-2">
            <div><label>Subject</label><input className="input" value={subject} onChange={e => setSubject(e.target.value)} /></div>
            <div><label>Topic</label><input className="input" value={topic} onChange={e => setTopic(e.target.value)} /></div>
            <div><label>Level</label>
              <select className="select" value={level} onChange={e => setLevel(e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <button className="btn" onClick={generateQuiz} disabled={loading}>{loading ? "Generating..." : "Generate Quiz"}</button>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {questions.length > 0 && !result && (
        <div className="card">
          {questions.map((q, i) => (
            <div key={i} style={{marginBottom: '2rem'}}>
              <h4>{i + 1}. {q.question}</h4>
              {q.options.map((opt, j) => (
                <div key={j} style={{margin: '0.5rem 0'}}>
                  <label>
                    <input type="radio" name={`q-${i}`} value={opt} onChange={() => setAnswers({...answers, [i]: opt})} />
                    {' '}{opt}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button className="btn" onClick={submitQuiz} disabled={loading || Object.keys(answers).length < questions.length}>
            {loading ? "Evaluating..." : "Submit Quiz"}
          </button>
        </div>
      )}

      {result && (
        <div className="card">
          <h3>Results</h3>
          <p>Score: {result.score} / {result.total}</p>
          <p>Percentage: {result.percentage}%</p>
          <p>{result.percentage >= 80 ? "Great job!" : "Keep practicing!"}</p>
          
          {recommendation && (
            <div style={{marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px'}}>
              <h4>Your next recommended topic:</h4>
              <p>{recommendation}</p>
            </div>
          )}
          
          <button className="btn" style={{marginTop: '1rem'}} onClick={() => {setQuestions([]); setResult(null);}}>Take Another Quiz</button>
        </div>
      )}
    </div>
  );
}
