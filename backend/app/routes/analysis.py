import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, DashboardSummary
from app.auth.deps import get_current_user
from app.nlp.matcher import calculate_match

router = APIRouter(prefix="/analysis", tags=["NLP Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_resume(
    req: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Retrieve resume
    if req.resume_id:
        resume = db.query(Resume).filter(
            Resume.id == req.resume_id,
            Resume.user_id == current_user.id
        ).first()
    else:
        resume = db.query(Resume).filter(
            Resume.user_id == current_user.id
        ).order_by(Resume.uploaded_at.desc()).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No resume found. Please upload a PDF resume before performing an analysis."
        )

    # Validate job description
    clean_jd = req.job_description.strip()
    if len(clean_jd) < 15:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description is too short. Please provide a detailed job description."
        )

    # Execute NLP Matching Pipeline
    nlp_results = calculate_match(resume.extracted_text, clean_jd)

    job_title = req.job_title.strip() if req.job_title else "Target Job Position"

    # Save to database
    new_analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_title=job_title,
        job_description=clean_jd,
        match_score=nlp_results["match_score"],
        matched_skills=json.dumps(nlp_results["matched_skills"]),
        missing_skills=json.dumps(nlp_results["missing_skills"]),
        recommendation=nlp_results["recommendation"],
        created_at=datetime.utcnow()
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)

    return {
        "id": new_analysis.id,
        "resume_id": new_analysis.resume_id,
        "job_title": new_analysis.job_title,
        "job_description": new_analysis.job_description,
        "match_score": new_analysis.match_score,
        "matched_skills": nlp_results["matched_skills"],
        "missing_skills": nlp_results["missing_skills"],
        "resume_skills": nlp_results["resume_skills"],
        "job_skills": nlp_results["job_skills"],
        "recommendation": new_analysis.recommendation,
        "classification": nlp_results["classification"],
        "created_at": new_analysis.created_at
    }

@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check latest resume
    latest_resume = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.uploaded_at.desc()).first()

    has_resume = latest_resume is not None
    resume_filename = latest_resume.filename if latest_resume else None
    skills_count = 0
    if latest_resume and latest_resume.detected_skills:
        skills_count = len(json.loads(latest_resume.detected_skills))

    # All analyses for user
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).all()

    total_analyses = len(analyses)
    avg_score = 0.0
    latest_score = None
    latest_job_title = None

    if total_analyses > 0:
        avg_score = round(sum(a.match_score for a in analyses) / total_analyses, 1)
        latest_score = analyses[0].match_score
        latest_job_title = analyses[0].job_title

    recent_list = []
    for a in analyses[:5]:
        recent_list.append({
            "id": a.id,
            "job_title": a.job_title,
            "match_score": a.match_score,
            "recommendation": a.recommendation,
            "classification": (
                "Strong Match" if a.match_score >= 80 else
                "Good Match" if a.match_score >= 60 else
                "Moderate Match" if a.match_score >= 40 else "Weak Match"
            ),
            "matched_skills": json.loads(a.matched_skills) if a.matched_skills else [],
            "missing_skills": json.loads(a.missing_skills) if a.missing_skills else [],
            "created_at": a.created_at.isoformat()
        })

    return {
        "has_resume": has_resume,
        "resume_filename": resume_filename,
        "skills_count": skills_count,
        "total_analyses": total_analyses,
        "average_match": avg_score,
        "latest_match": latest_score,
        "latest_job_title": latest_job_title,
        "recent_analyses": recent_list
    }

@router.get("/history", response_model=List[dict])
def get_analysis_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).all()

    results = []
    for a in analyses:
        results.append({
            "id": a.id,
            "resume_id": a.resume_id,
            "job_title": a.job_title,
            "job_description": a.job_description,
            "match_score": a.match_score,
            "classification": (
                "Strong Match" if a.match_score >= 80 else
                "Good Match" if a.match_score >= 60 else
                "Moderate Match" if a.match_score >= 40 else "Weak Match"
            ),
            "matched_skills": json.loads(a.matched_skills) if a.matched_skills else [],
            "missing_skills": json.loads(a.missing_skills) if a.missing_skills else [],
            "recommendation": a.recommendation,
            "created_at": a.created_at.isoformat()
        })
    return results

@router.get("/{id}", response_model=dict)
def get_analysis_by_id(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == id,
        Analysis.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found.")

    resume = db.query(Resume).filter(Resume.id == analysis.resume_id).first() if analysis.resume_id else None

    return {
        "id": analysis.id,
        "resume_id": analysis.resume_id,
        "resume_filename": resume.filename if resume else "Unknown",
        "job_title": analysis.job_title,
        "job_description": analysis.job_description,
        "match_score": analysis.match_score,
        "classification": (
            "Strong Match" if analysis.match_score >= 80 else
            "Good Match" if analysis.match_score >= 60 else
            "Moderate Match" if analysis.match_score >= 40 else "Weak Match"
        ),
        "matched_skills": json.loads(analysis.matched_skills) if analysis.matched_skills else [],
        "missing_skills": json.loads(analysis.missing_skills) if analysis.missing_skills else [],
        "recommendation": analysis.recommendation,
        "created_at": analysis.created_at.isoformat()
    }
