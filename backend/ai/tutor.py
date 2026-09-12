from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from ai.rag_engine import retrieve_relevant_context

def get_tutor_response(course_id: int, student_query: str, chat_history: list = None) -> str:
    context = retrieve_relevant_context(student_query, course_id)
    
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.4)
    prompt = ChatPromptTemplate.from_template(
        "You are EduAdapt AI Tutor, a encouraging and precise teacher.\n"
        "Use the syllabus context below to answer the student's question.\n"
        "Guidelines:\n"
        "1. Explain simply using analogies.\n"
        "2. Do NOT give direct test answers immediately; encourage critical thinking.\n"
        "3. Keep responses concise and focused on the syllabus.\n\n"
        "Syllabus Context:\n{context}\n\n"
        "Student Question:\n{query}"
    )
    
    chain = prompt | llm
    try:
        res = chain.invoke({"context": context, "query": student_query})
        return res.content
    except Exception:
        return "I am currently reviewing your course syllabus context. Please attempt the main diagnostic question again!"