'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCoursePath, createCourse } from '@/lib/api';

export default function Dashboard() {
  const [pathway, setPathway] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<number>(1);
  const [syllabusInput, setSyllabusInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPath(courseId);
  }, [courseId]);

  async function loadPath(id: number) {
    try {
      const data = await fetchCoursePath(id);
      if (data.pathway) setPathway(data.pathway);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateCourse() {
    if (!syllabusInput.trim()) return;
    setLoading(true);
    const res = await createCourse("Data Structures & Algorithms", syllabusInput);
    if (res.id) {
      setCourseId(res.id);
      await loadPath(res.id);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="text-xl font-bold text-blue-400 mb-8">EduAdapt AI</div>
          <nav className="space-y-3">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium">Dashboard</div>
            <Link href={`/courses/${courseId}/tutor`} className="block p-3 text-slate-400 hover:bg-slate-800 rounded-xl">AI Tutor</Link>
            <Link href={`/courses/${courseId}/quiz`} className="block p-3 text-slate-400 hover:bg-slate-800 rounded-xl">Take Quiz</Link>
          </nav>
        </div>
        <div className="text-xs text-slate-500">Hackathon Edition v1.0</div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Student Progress Dashboard</h1>
            <p className="text-slate-400 text-sm">Course ID #{courseId}: Data Structures & Algorithms</p>
          </div>
        </header>

        {/* Quick Syllabus Upload Section */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl mb-8">
          <h2 className="text-lg font-bold mb-2">Upload/Update Syllabus</h2>
          <textarea
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Paste syllabus concepts (e.g. Arrays, Linked Lists, Binary Search Trees, Graph Algorithms)..."
            value={syllabusInput}
            onChange={(e) => setSyllabusInput(e.target.value)}
          />
          <button
            onClick={handleCreateCourse}
            disabled={loading}
            className="mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition"
          >
            {loading ? "Analyzing Syllabus..." : "Process Syllabus"}
          </button>
        </div>

        {/* Pathway Tree / List */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h2 className="text-lg font-bold mb-6">Personalized Learning Path</h2>
          <div className="space-y-4">
            {pathway.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    item.status === 'MASTERED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'NEEDS_REVISION' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'MASTERED' ? 'bg-emerald-500/10 text-emerald-400' :
                    item.status === 'NEEDS_REVISION' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.status}
                  </span>
                  <Link href={`/courses/${courseId}/quiz`} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg">
                    Test Topic
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
