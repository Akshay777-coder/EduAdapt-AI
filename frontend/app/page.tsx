import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <header className="border-b border-slate-800 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">E</div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            EduAdapt AI
          </span>
        </div>
        <Link href="/dashboard" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition">
          Launch Platform
        </Link>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center my-16">
        <div className="inline-block px-4 py-1.5 bg-blue-950 text-blue-400 border border-blue-800 rounded-full text-sm font-semibold mb-6">
          Syllabus-Grounded Adaptive AI
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Learn Smarter. <br />
          <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
            Not Harder.
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          EduAdapt AI generates a personalized learning path grounded strictly in your exact syllabus, continuously adapting as you test your knowledge.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20">
            Start Demo
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-2xl mb-3">📚</div>
            <h3 className="font-bold text-lg mb-2">Syllabus Grounded</h3>
            <p className="text-slate-400 text-sm">RAG technology ensures the AI sticks strictly to your specific curriculum.</p>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Adaptive Pathway</h3>
            <p className="text-slate-400 text-sm">Dynamic pathway rerouting automatically addresses detected knowledge gaps.</p>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-2xl mb-3">🧠</div>
            <h3 className="font-bold text-lg mb-2">AI Adaptive Tutor</h3>
            <p className="text-slate-400 text-sm">Interactive tutor that guides learning without spoiling direct solutions.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
