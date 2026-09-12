'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateQuiz, submitQuiz } from '@/lib/api';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id) || 1;

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      const data = await generateQuiz(courseId);
      setQuiz(data);
      setLoading(false);
    }
    loadQuiz();
  }, [courseId]);

  function handleSelect(qId: number, option: string) {
    setAnswers({ ...answers, [qId]: option });
  }

  async function handleSubmit() {
    if (!quiz) return;
    const res = await submitQuiz(quiz.quiz_id, answers);
    setResult(res);
  }

  if (loading) return <div className="min-h-screen bg-slate-950 text-white p-8">Loading Quiz...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Adaptive Assessment</h1>
      <p className="text-slate-400 text-sm mb-6">Topic: {quiz?.topic}</p>

      {!result ? (
        <div className="space-y-6">
          {quiz?.questions?.map((q: any, idx: number) => (
            <div key={q.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="font-semibold text-lg mb-4">{idx + 1}. {q.question}</h3>
              <div className="space-y-2">
                {q.options?.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition ${
                      answers[q.id] === opt
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl transition"
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">
          <div className="text-4xl font-extrabold text-blue-400 mb-2">{result.score}</div>
          <div className="text-slate-400 text-sm mb-6">Accuracy: {result.accuracy}%</div>

          <div className="text-left bg-slate-950 p-4 rounded-xl mb-6">
            <h4 className="font-bold text-sm text-slate-300 mb-2">AI Adaptation Feed:</h4>
            {result.recommendations?.map((rec: string, i: number) => (
              <p key={i} className="text-xs text-amber-400 mb-1">↳ {rec}</p>
            ))}
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 rounded-xl font-medium"
          >
            Back to Learning Path
          </button>
        </div>
      )}
    </div>
  );
}

