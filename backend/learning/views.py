from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import ai
from .models import StudyPlan, QuizAttempt

class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"})

class StudyPlanView(APIView):
    def post(self, request):
        data = request.data
        try:
            plan = ai.generate_study_plan(
                subject=data.get('subject'),
                level=data.get('level'),
                daily_hours=data.get('daily_hours'),
                exam_date=data.get('exam_date')
            )
            StudyPlan.objects.create(subject=data.get('subject'), plan=plan)
            return Response({"plan": plan})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TutorView(APIView):
    def post(self, request):
        data = request.data
        try:
            answer = ai.ask_tutor(
                question=data.get('question'),
                level=data.get('level')
            )
            return Response({"answer": answer})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuizView(APIView):
    def post(self, request):
        data = request.data
        try:
            quiz = ai.generate_quiz(
                subject=data.get('subject'),
                topic=data.get('topic'),
                level=data.get('level')
            )
            return Response(quiz)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuizSubmitView(APIView):
    def post(self, request):
        data = request.data
        subject = data.get('subject')
        topic = data.get('topic')
        answers = data.get('answers', [])
        correct_answers = data.get('correct_answers', [])
        
        score = sum(1 for a, c in zip(answers, correct_answers) if a == c)
        total = len(correct_answers)
        percentage = (score / total) * 100 if total > 0 else 0
        
        QuizAttempt.objects.create(
            subject=subject,
            topic=topic,
            score=score,
            total=total
        )
        return Response({"score": score, "total": total, "percentage": percentage})

class RecommendView(APIView):
    def post(self, request):
        data = request.data
        try:
            rec = ai.generate_recommendation(
                subject=data.get('subject'),
                score=data.get('score'),
                topic=data.get('topic')
            )
            return Response({"recommendation": rec})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
