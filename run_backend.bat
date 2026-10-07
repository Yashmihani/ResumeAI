@echo off
title ResumeAI Backend (FastAPI)
echo ===================================================
echo  ResumeAI — NLP Resume Screening Backend
echo  FastAPI + SQLite + NLTK + Scikit-learn
echo ===================================================

:: Ensure NLTK resources are present before starting the server.
:: Downloads only if missing; skips silently if already present.
echo [1/2] Checking NLTK resources...
call .\venv\Scripts\activate.bat
python -c "from app.nlp.preprocessing import ensure_nltk_resources; ensure_nltk_resources(); print('  NLTK resources OK')" 2>nul || (
    echo   Warning: NLTK check skipped — resources will auto-download on first request.
)

echo [2/2] Starting FastAPI server on http://127.0.0.1:8000 ...
echo       API docs available at: http://127.0.0.1:8000/docs
echo ===================================================
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
