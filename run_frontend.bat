@echo off
title ResumeAI Frontend (Vite + React)
echo ===================================================
echo  ResumeAI — NLP Resume Screening Frontend
echo  React 18 + Vite + Tailwind CSS
echo ===================================================
echo  Dev server  : http://localhost:3000
echo  API proxy   : /api  →  http://127.0.0.1:8000
echo  (Make sure the backend is running first)
echo ===================================================
cd frontend
npx vite --port 3000
pause
