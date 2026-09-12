from django.db import models
from django.contrib.auth.models import User
from pgvector.django import VectorField

class Course(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="courses")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class SyllabusTopic(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="topics")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    parent_topic = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name="subtopics")
    difficulty = models.CharField(max_length=50, default="Medium")
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.course.title} - {self.name}"

class TopicEmbedding(models.Model):
    topic = models.ForeignKey(SyllabusTopic, on_delete=models.CASCADE, related_name="embeddings")
    content = models.TextField()
    embedding = VectorField(dimensions=1536)  # text-embedding-3-small

    def __str__(self):
        return f"Embedding for {self.topic.name}"

class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="quizzes")
    title = models.CharField(max_length=255)
    is_diagnostic = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    topic = models.ForeignKey(SyllabusTopic, on_delete=models.CASCADE)
    question = models.TextField()
    options = models.JSONField()  # Store list of options as JSON
    correct_answer = models.CharField(max_length=255)
    explanation = models.TextField()
    difficulty = models.CharField(max_length=50, default="medium")

class QuizAttempt(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField()
    accuracy = models.FloatField()
    completed_at = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField()

class LearningProgress(models.Model):
    STATUS_CHOICES = [
        ('MASTERED', 'Mastered'),
        ('IN_PROGRESS', 'In Progress'),
        ('NEEDS_REVISION', 'Needs Revision'),
        ('LOCKED', 'Locked'),
    ]
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.ForeignKey(SyllabusTopic, on_delete=models.CASCADE)
    mastery_score = models.FloatField(default=0.0)  # 0.0 to 100.0
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='LOCKED')
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'topic')