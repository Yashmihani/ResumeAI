import os
import uuid
import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse, ResumeDetailResponse
from app.auth.deps import get_current_user
from app.services.pdf_extractor import extract_text_from_pdf, PDFExtractionError
from app.nlp.skills import extract_skills

router = APIRouter(prefix="/resumes", tags=["Resumes"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads/resumes")
os.makedirs(UPLOAD_DIR, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate PDF extension and content type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF files (.pdf) are accepted."
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 10 MB limit."
        )

    # Extract text from PDF
    try:
        extracted_text = extract_text_from_pdf(file_bytes)
    except PDFExtractionError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )

    # Extract skills
    detected_skills = extract_skills(extracted_text)

    # Save physical file to disk
    unique_filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Store in database
    new_resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text,
        detected_skills=json.dumps(detected_skills),
        uploaded_at=datetime.utcnow()
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {
        "id": new_resume.id,
        "filename": new_resume.filename,
        "uploaded_at": new_resume.uploaded_at,
        "skills_count": len(detected_skills),
        "detected_skills": detected_skills
    }

@router.get("/my", response_model=List[ResumeResponse])
def get_my_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.uploaded_at.desc()).all()
    results = []
    for r in resumes:
        skills = json.loads(r.detected_skills) if r.detected_skills else []
        results.append({
            "id": r.id,
            "filename": r.filename,
            "uploaded_at": r.uploaded_at,
            "skills_count": len(skills),
            "detected_skills": skills
        })
    return results

@router.get("/{id}", response_model=ResumeDetailResponse)
def get_resume_detail(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
    skills = json.loads(resume.detected_skills) if resume.detected_skills else []
    return {
        "id": resume.id,
        "filename": resume.filename,
        "file_path": resume.file_path,
        "extracted_text": resume.extracted_text,
        "detected_skills": skills,
        "uploaded_at": resume.uploaded_at
    }

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")

    if os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception:
            pass

    db.delete(resume)
    db.commit()
    return None
