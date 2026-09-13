# EduAdapt-AI

EduAdapt-AI is an AI-powered personalized learning companion built for a hackathon MVP. It features an adaptive AI Tutor, a Study Planner, and dynamic Quiz Generation using LangChain and OpenAI.

## Features
- **Study Planner**: Generates personalized day-by-day learning schedules.
- **AI Tutor**: Answers technical and general questions, adapted to the student's level.
- **Dynamic Quizzes**: Auto-generates 5-question quizzes on any topic, grades them, and recommends next steps.

## Tech Stack
- **Backend:** Django, Django REST Framework, LangChain, SQLite
- **Frontend:** Next.js (App Router), React, Native Fetch API

## Requirements
- Node.js >= 18
- Python >= 3.10
- OpenAI API Key

## Setup & Running

**1. Backend (Django)**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# EDIT .env to include your OPENAI_API_KEY
python manage.py makemigrations learning
python manage.py migrate
python manage.py runserver
