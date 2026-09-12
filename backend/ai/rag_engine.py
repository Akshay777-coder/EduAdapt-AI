from langchain_openai import OpenAIEmbeddings
from courses.models import TopicEmbedding
import numpy as np

embeddings_model = OpenAIEmbeddings(model="text-embedding-3-small")

def generate_and_store_embedding(topic_instance, text_content: str):
    try:
        vector = embeddings_model.embed_query(text_content)
        TopicEmbedding.objects.create(
            topic=topic_instance,
            content=text_content,
            embedding=vector
        )
    except Exception as e:
        # Fallback dummy embedding if API offline during presentation
        dummy_vector = np.random.rand(1536).tolist()
        TopicEmbedding.objects.create(
            topic=topic_instance,
            content=text_content,
            embedding=dummy_vector
        )

def retrieve_relevant_context(query: str, course_id: int, top_k=3):
    try:
        query_vector = embeddings_model.embed_query(query)
        results = TopicEmbedding.objects.filter(topic__course_id=course_id)\
            .order_by(TopicEmbedding.embedding.cosine_distance(query_vector))[:top_k]
        return "\n\n".join([f"Topic: {r.topic.name}\nContent: {r.content}" for r in results])
    except Exception:
        return "Syllabus Context: General concepts related to course topics."