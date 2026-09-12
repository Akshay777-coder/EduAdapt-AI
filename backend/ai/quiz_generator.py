from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class QuestionModel(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str
    difficulty: str

class QuizModel(BaseModel):
    questions: List[QuestionModel]

def generate_topic_quiz(topic_name: str, context: str, difficulty: str = "Medium", count: int = 3):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
    parser = JsonOutputParser(pydantic_object=QuizModel)

    prompt = ChatPromptTemplate.from_template(
        "Generate a {count}-question multiple choice quiz on '{topic}' at '{difficulty}' difficulty.\n"
        "Ground questions strictly in this syllabus context:\n{context}\n\n"
        "{format_instructions}"
    )

    chain = prompt | llm | parser
    try:
        res = chain.invoke({
            "count": count,
            "topic": topic_name,
            "difficulty": difficulty,
            "context": context,
            "format_instructions": parser.get_format_instructions()
        })
        return res.get("questions", [])
    except Exception:
        return [{
            "question": f"What is the key characteristic of {topic_name}?",
            "options": ["High efficiency", "Random access", "Hierarchical links", "Linear memory"],
            "correct_answer": "Linear memory",
            "explanation": "Standard fallback question explanation.",
            "difficulty": difficulty
        }]
