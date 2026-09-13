from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health'),
    path('study-plan/', views.StudyPlanView.as_view(), name='study-plan'),
    path('tutor/', views.TutorView.as_view(), name='tutor'),
    path('quiz/', views.QuizView.as_view(), name='quiz'),
    path('quiz/submit/', views.QuizSubmitView.as_view(), name='quiz-submit'),
    path('recommend/', views.RecommendView.as_view(), name='recommend'),
]
