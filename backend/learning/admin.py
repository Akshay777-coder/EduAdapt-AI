from django.contrib import admin
from .models import StudentProfile, StudyPlan, QuizAttempt

admin.site.register(StudentProfile)
admin.site.register(StudyPlan)
admin.site.register(QuizAttempt)
