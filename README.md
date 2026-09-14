\# 🎓 EduAdapt-AI



\*\*EduAdapt-AI\*\* is an AI-powered personalized learning platform designed to help students learn more effectively using AI.



It provides features like \*\*AI-based learning assistance, personalized study planning, and quiz generation\*\*.



\## 🛠️ Tech Stack



\### Backend



\* Python

\* Django

\* Django REST Framework

\* LangChain

\* OpenAI API

\* SQLite



\### Frontend



\* Next.js

\* React

\* JavaScript

\* CSS



\## 📁 Project Structure



```text

EduAdapt-AI/

├── backend/      # Django + AI backend

├── frontend/     # Next.js frontend

└── README.md

```



\## 🚀 How to Run



\### 1. Backend



Open \*\*Terminal 1\*\*:



```cmd

cd backend



python -m venv venv

venv\\Scripts\\activate



pip install -r requirements.txt



copy .env.example .env

notepad .env

```



Add your \*\*OpenAI API Key\*\* in `.env`.



Then run:



```cmd

python manage.py makemigrations learning

python manage.py migrate

python manage.py runserver

```



Backend will run at:



```text

http://127.0.0.1:8000/

```



\---



\### 2. Frontend



Open \*\*Terminal 2\*\*:



```cmd

cd frontend



npm install



copy .env.local.example .env.local



npm run dev

```



Frontend will run at:



```text

http://localhost:3000/

```



Open the frontend URL in your browser.



\## 🔑 Environment Variables



\### Backend



Create:



```text

backend/.env

```



using:



```cmd

copy .env.example .env

```



Add your OpenAI API key according to the variables provided in `.env.example`.



\### Frontend



Create:



```text

frontend/.env.local

```



using:



```cmd

copy .env.local.example .env.local

```



\## 🔄 Application Flow



```text

Next.js Frontend

&#x20;      ↓

Django REST API

&#x20;      ↓

LangChain

&#x20;      ↓

OpenAI API

&#x20;      ↓

AI Response

&#x20;      ↓

Frontend

```



\## 👨‍💻 Author



\*\*Akshay Kumar\*\*



GitHub: https://github.com/Akshay777-coder



