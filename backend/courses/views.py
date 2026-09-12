from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Course, SyllabusTopic, LearningProgress, Quiz, Question, QuizAttempt, Answer
from ai.syllabus_analyzer import parse_syllabus_text
from ai.rag_engine import generate_and_store_embedding
from ai.quiz_generator import generate_topic_quiz
from ai.adaptive_engine import evaluate_and_adapt
from ai.tutor import get_tutor_response

@api_view(['GET', 'POST'])
@permission_classes([AllowAny]) # Simplified for rapid hackathon testing
def courses_list_create(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        data = [{"id": c.id, "title": c.title, "description": c.description} for c in courses]
        return Response(data)
    
    elif request.method == 'POST':
        title = request.data.get('title')
        syllabus_text = request.data.get('syllabus_text', '')
        
        # Default fallback user for fast hackathon demo
        user = request.user if request.user.is_authenticated else None
        course = Course.objects.create(student=user, title=title, description=syllabus_text[:100])
        
        # Analyze syllabus via AI
        parsed_topics = parse_syllabus_text(syllabus_text)
        
        for idx, t_data in enumerate(parsed_topics):
            topic = SyllabusTopic.objects.create(
                course=course,
                name=t_data.get('name'),
                description=t_data.get('description', ''),
                difficulty=t_data.get('difficulty', 'Medium'),
                order=idx
            )
            # Store RAG Embedding
            generate_and_store_embedding(topic, f"{topic.name}: {topic.description}")
            
            # Initialize Default Progress
            if user:
                LearningProgress.objects.create(student=user, topic=topic, status='LOCKED' if idx > 0 else 'IN_PROGRESS')

        return Response({"id": course.id, "message": "Course created & analyzed successfully!"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def course_learning_path(request, course_id):
    topics = SyllabusTopic.objects.filter(course_id=course_id).order_by('order')
    pathway = []
    
    for t in topics:
        prog = LearningProgress.objects.filter(topic=t).first()
        status_val = prog.status if prog else ('IN_PROGRESS' if t.order == 0 else 'LOCKED')
        mastery = prog.mastery_score if prog else 0.0
        
        pathway.append({
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "difficulty": t.difficulty,
            "status": status_val,
            "mastery_score": mastery
        })
    return Response({"course_id": course_id, "pathway": pathway})

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_quiz_api(request, course_id):
    topic_id = request.data.get('topic_id')
    topic = SyllabusTopic.objects.get(id=topic_id) if topic_id else SyllabusTopic.objects.filter(course_id=course_id).first()
    
    questions_raw = generate_topic_quiz(topic.name, topic.description)
    
    quiz = Quiz.objects.create(course_id=course_id, title=f"{topic.name} Adaptive Test")
    created_q_data = []
    
    for q_item in questions_raw:
        q_obj = Question.objects.create(
            quiz=quiz,
            topic=topic,
            question=q_item.get('question'),
            options=q_item.get('options'),
            correct_answer=q_item.get('correct_answer'),
            explanation=q_item.get('explanation'),
            difficulty=q_item.get('difficulty', 'Medium')
        )
        created_q_data.append({
            "id": q_obj.id,
            "question": q_obj.question,
            "options": q_obj.options,
            "difficulty": q_obj.difficulty
        })
        
    return Response({"quiz_id": quiz.id, "topic": topic.name, "questions": created_q_data})

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_quiz_api(request, quiz_id):
    quiz = Quiz.objects.get(id=quiz_id)
    user_answers = request.data.get('answers', {}) # Dict of {question_id: selected_option}
    
    correct_cnt = 0
    total_q = quiz.questions.count()
    
    user = request.user if request.user.is_authenticated else None
    attempt = QuizAttempt.objects.create(student=user, quiz=quiz, score=0, accuracy=0)
    
    for q in quiz.questions.all():
        user_choice = user_answers.get(str(q.id))
        is_corr = (user_choice == q.correct_answer)
        if is_corr:
            correct_cnt += 1
        Answer.objects.create(attempt=attempt, question=q, selected_answer=user_choice or "", is_correct=is_corr)
        
    accuracy = (correct_cnt / total_q) * 100 if total_q > 0 else 0
    attempt.score = correct_cnt
    attempt.accuracy = accuracy
    attempt.save()
    
    recs = []
    if user:
        recs = evaluate_and_adapt(user, quiz.course.id, attempt)
        
    return Response({
        "score": f"{correct_cnt}/{total_q}",
        "accuracy": accuracy,
        "recommendations": recs
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def tutor_chat_api(request, course_id):
    query = request.data.get('message', '')
    response_text = get_tutor_response(course_id, query)
    return Response({"reply": response_text})