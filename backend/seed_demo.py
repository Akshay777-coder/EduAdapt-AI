import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from courses.models import Course, SyllabusTopic, LearningProgress
from django.contrib.auth.models import User

def run_seed():
    print("Seeding hackathon demo data...")
    user, _ = User.objects.get_or_create(username="demo_student", email="demo@eduadapt.ai")
    
    course, _ = Course.objects.get_or_create(
        student=user,
        title="Data Structures & Algorithms",
        description="Comprehensive Data Structures Course"
    )

    topics_data = [
        ("Arrays & Vectors", "Contiguous memory structures and indexing.", "Easy", "MASTERED", 90.0),
        ("Linked Lists", "Node-based linear pointer structures.", "Medium", "IN_PROGRESS", 65.0),
        ("Stacks & Queues", "LIFO and FIFO linear collections.", "Medium", "IN_PROGRESS", 70.0),
        ("Binary Trees", "Hierarchical tree nodes and traversals.", "Hard", "NEEDS_REVISION", 30.0),
        ("Graph Algorithms", "Nodes, edges, BFS, DFS, and shortest path.", "Hard", "LOCKED", 0.0),
    ]

    for idx, (name, desc, diff, status, mastery) in enumerate(topics_data):
        topic, _ = SyllabusTopic.objects.get_or_create(
            course=course,
            name=name,
            defaults={"description": desc, "difficulty": diff, "order": idx}
        )
        LearningProgress.objects.update_or_create(
            student=user,
            topic=topic,
            defaults={"status": status, "mastery_score": mastery}
        )

    print("Demo seed complete! Course ID:", course.id)

if __name__ == '__main__':
    run_seed()