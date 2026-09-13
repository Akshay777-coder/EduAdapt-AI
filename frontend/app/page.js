import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero">
      <h1>Welcome to EduAdapt-AI</h1>
      <p>Your AI-powered personalized learning companion.</p>
      <div className="hero-btns">
        <Link href="/dashboard"><button className="btn">Start Learning</button></Link>
        <Link href="/tutor"><button className="btn" style={{background: '#64748b'}}>AI Tutor</button></Link>
        <Link href="/planner"><button className="btn" style={{background: '#10b981'}}>Study Planner</button></Link>
        <Link href="/quiz"><button className="btn" style={{background: '#f59e0b'}}>Take Quiz</button></Link>
      </div>
    </div>
  );
}
