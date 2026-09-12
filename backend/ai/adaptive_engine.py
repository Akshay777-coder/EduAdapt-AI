from courses.models import LearningProgress, SyllabusTopic

def evaluate_and_adapt(student, course_id, quiz_attempt):
    """
    Core Adaptation Logic:
    Score >= 80%: Mark Mastered -> Unlock next topic
    Score 60-79%: In Progress -> Practice
    Score < 60%: Needs Revision -> Highlight weakness & suggest prerequisite review
    """
    answers = quiz_attempt.answers.all()
    topic_scores = {}

    for ans in answers:
        t = ans.question.topic
        if t.id not in topic_scores:
            topic_scores[t.id] = {"correct": 0, "total": 0, "instance": t}
        topic_scores[t.id]["total"] += 1
        if ans.is_correct:
            topic_scores[t.id]["correct"] += 1

    recommendations = []

    for t_id, data in topic_scores.items():
        score_pct = (data["correct"] / data["total"]) * 100
        topic_inst = data["instance"]
        prog, _ = LearningProgress.objects.get_or_create(student=student, topic=topic_inst) 
        
        prog.mastery_score = score_pct

        if score_pct >= 80.0:
            prog.status = 'MASTERED'
            recommendations.append(f"Great job! You mastered {topic_inst.name}. Move to the next subtopic.")
        elif score_pct >= 60.0:
            prog.status = 'IN_PROGRESS'
            recommendations.append(f"Keep going! Review {topic_inst.name} for higher accuracy.")
        else:
            prog.status = 'NEEDS_REVISION'
            recommendations.append(f"Knowledge Gap Detected in {topic_inst.name}. Review foundational prerequisites.")

        prog.save()

    return recommendations