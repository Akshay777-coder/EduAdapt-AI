const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchCoursePath(courseId: number) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/learning-path/`);
  return res.json();
}

export async function createCourse(title: string, syllabusText: string) {
  const res = await fetch(`${API_BASE}/courses/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, syllabus_text: syllabusText }),
  });
  return res.json();
}

export async function generateQuiz(courseId: number, topicId?: number) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/quiz/generate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic_id: topicId }),
  });
  return res.json();
}

export async function submitQuiz(quizId: number, answers: Record<string, string>) {
  const res = await fetch(`${API_BASE}/courses/quiz/${quizId}/submit/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  return res.json();
}

export async function askTutor(courseId: number, message: string) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/tutor/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return res.json();
}
