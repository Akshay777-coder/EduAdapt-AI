import os
import json
from langchain_openai import ChatOpenAI
from .prompts import STUDY_PLAN_PROMPT, TUTOR_PROMPT, QUIZ_PROMPT, RECOMMENDATION_PROMPT

def get_llm():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not configured.")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    return ChatOpenAI(model=model, temperature=0.7, api_key=api_key)

def generate_study_plan(subject, level, daily_hours, exam_date):
    llm = get_llm()
    chain = STUDY_PLAN_PROMPT | llm
    res = chain.invoke({
        "subject": subject,
        "level": level,
        "daily_hours": daily_hours,
        "exam_date": exam_date
    })
    return res.content

def ask_tutor(question, level):
    llm = get_llm()
    chain = TUTOR_PROMPT | llm
    res = chain.invoke({"question": question, "level": level})
    return res.content

def generate_quiz(subject, topic, level):
    llm = get_llm()
    chain = QUIZ_PROMPT | llm
    res = chain.invoke({"subject": subject, "topic": topic, "level": level})
    raw = res.content.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    return json.loads(raw.strip())

def generate_recommendation(subject, score, topic):
    llm = get_llm()
    chain = RECOMMENDATION_PROMPT | llm
    res = chain.invoke({"subject": subject, "score": score, "topic": topic})
    return res.content