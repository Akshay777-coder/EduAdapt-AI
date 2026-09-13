"use client";
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('eduProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setProfile({ level: 'Beginner', subjects: 'Python, Math', dailyHours: 2, lastScore: 'N/A', nextTopic: 'Python Lists' });
    }
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome to EduAdapt-AI Dashboard</h2>
      <div className="grid-2">
        <div className="card">
          <h3>Current Level</h3>
          <p>{profile.level}</p>
        </div>
        <div className="card">
          <h3>Subjects</h3>
          <p>{profile.subjects}</p>
        </div>
        <div className="card">
          <h3>Daily Study Time</h3>
          <p>{profile.dailyHours} hours</p>
        </div>
        <div className="card">
          <h3>Latest Quiz Score</h3>
          <p>{profile.lastScore}</p>
        </div>
      </div>
      <div className="card" style={{background: '#e0e7ff', borderColor: '#c7d2fe'}}>
        <h3>Recommended Next Topic</h3>
        <p>{profile.nextTopic}</p>
      </div>
    </div>
  );
}
