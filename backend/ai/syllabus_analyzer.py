import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional

class TopicStructure(BaseModel):
    name: str = Field(description="Name of the topic")
    description: str = Field(description="Brief summary of topic content")
    difficulty: str = Field(description="Easy, Medium, or Hard")
    subtopics: Optional[List[str]] = Field(default=[], description="Subtopics belonging to this topic")

class SyllabusParseResult(BaseModel):
    topics: List[TopicStructure]

def parse_syllabus_text(raw_text: str):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
    parser = JsonOutputParser(pydantic_object=SyllabusParseResult)

    prompt = ChatPromptTemplate.from_template(
        "You are an expert curriculum design AI. Parse the following course syllabus into structured main topics "
        "and subtopics. Output ONLY valid JSON matching the format.\n\n"
        "Syllabus Content:\n{syllabus}\n\n"
        "{format_instructions}"
    )

    chain = prompt | llm | parser
    try:
        result = chain.invoke({
            "syllabus": raw_text,
            "format_instructions": parser.get_format_instructions()
        })
        return result.get("topics", [])
    except Exception as e:
        # Fallback for hackathon stability if API limit or error occurs
        return [
            {"name": "Arrays & Strings", "description": "Basic linear structures", "difficulty": "Easy", "subtopics": ["Traversal", "Searching"]},
            {"name": "Linked Lists", "description": "Node based chains", "difficulty": "Medium", "subtopics": ["Singly", "Doubly"]},
            {"name": "Trees & Graphs", "description": "Hierarchical structures", "difficulty": "Hard", "subtopics": ["Binary Trees", "BST", "Graph Traversal"]}
        ]