import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'EduAdapt-AI',
  description: 'Your AI-powered personalized learning companion.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/" className="brand">EduAdapt-AI</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/tutor">AI Tutor</Link>
          <Link href="/planner">Study Planner</Link>
          <Link href="/quiz">Take Quiz</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
