'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { askTutor } from '@/lib/api';

export default function TutorPage() {
  const params = useParams();
  const courseId = Number(params.id) || 1;

  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'ai', text: 'Hello! I am your EduAdapt AI tutor grounded in your course syllabus. What topic are you stuck on?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const res = await askTutor(courseId, userMsg);
    setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans max-w-4xl mx-auto p-6">
      <header className="mb-6 border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold">RAG-Grounded AI Tutor</h1>
        <p className="text-xs text-slate-400">Contextual learning based on your exact syllabus topics.</p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-lg p-4 rounded-2xl text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-slate-500">AI Tutor is analyzing your syllabus context...</div>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
          placeholder="Ask a question (e.g. 'Explain recursion with an analogy')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl transition text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
