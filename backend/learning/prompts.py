from langchain_core.prompts import PromptTemplate

STUDY_PLAN_PROMPT = PromptTemplate(
    input_variables=["subject", "level", "daily_hours", "exam_date"],
    template="""You are an expert academic planner.
Create a practical, concise study plan for a {level} student learning {subject}.
They can study {daily_hours} hours a day. Their target date is {exam_date}.

Include:
- Learning goals
- Day-by-day plan
- Topics to cover
- Practice tasks
- Revision strategy

Output the plan in clear text format."""
)

TUTOR_PROMPT = PromptTemplate(
    input_variables=["level", "question"],
    template="""You are an AI tutor. Answer the student's question based on their level: {level}.

Question: {question}

Guidelines per level:
- Beginner: Use simple language, short explanations, and an everyday analogy.
- Intermediate: Provide technical explanations, code/practical examples, and mention common mistakes.
- Advanced: Provide deeper technical details, cover edge cases, and discuss best practices.

Answer directly and concisely."""
)

QUIZ_PROMPT = PromptTemplate(
    input_variables=["subject", "topic", "level"],
    template="""Generate exactly 5 multiple-choice questions for a {level} student about {subject}: {topic}.
Each question MUST contain: a question, 4 options (A, B, C, D), the correct answer, and an explanation.

You MUST return valid JSON ONLY. Do not use markdown wrappers like ```json. Return exactly this structure:
{{
  "questions": [
    {{
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "explanation text"
    }}
  ]
}}"""
)

RECOMMENDATION_PROMPT = PromptTemplate(
    input_variables=["subject", "topic", "score"],
    template="""A student took a 5-question quiz on {subject}: {topic} and scored {score}/5.
Based on this score, provide a concise 2-sentence recommendation on what they should learn or do next.
If they scored low, suggest review topics. If they scored high, suggest the next logical advanced topic."""
)