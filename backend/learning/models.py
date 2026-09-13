from django.db import models

class StudentProfile(models.Model):
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    subjects = models.TextField()
    daily_hours = models.IntegerField()
    exam_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class StudyPlan(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, null=True, blank=True)
    subject = models.CharField(max_length=100)
    plan = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class QuizAttempt(models.Model):
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    score = models.IntegerField()
    total = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
