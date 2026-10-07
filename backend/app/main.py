import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models  # Ensure models are loaded before table creation
from app.routes import auth, resumes, analysis, users

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ResumeAI — NLP Resume Screening & Job Matching API",
    description="College Mini Project NLP API utilizing TF-IDF and Cosine Similarity",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(resumes.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")

@app.get("/")
def root():
    return {
        "project": "ResumeAI",
        "description": "NLP-Based Resume Screening and Job Matching System",
        "status": "Online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "ResumeAI NLP Backend"}
