from django.urls import path
from . import views

urlpatterns = [
    path('', views.courses_list_create, name='courses_list_create'),
    path('<int:course_id>/learning-path/', views.course_learning_path, name='learning_path'),
    path('<int:course_id>/quiz/generate/', views.generate_quiz_api, name='generate_quiz'),
    path('quiz/<int:quiz_id>/submit/', views.submit_quiz_api, name='submit_quiz'),
    path('<int:course_id>/tutor/', views.tutor_chat_api, name='tutor_chat'),
]