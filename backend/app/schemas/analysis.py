from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class AnalysisRequest(BaseModel):
    resume_id: Optional[int] = None
    job_title: Optional[str] = Field("Target Job Position", max_length=150)
    job_description: str = Field(..., min_length=10, description="Job description text")

class AnalysisResponse(BaseModel):
    id: int
    resume_id: Optional[int]
    job_title: str
    job_description: str
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    resume_skills: List[str]
    job_skills: List[str]
    recommendation: str
    classification: str
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    has_resume: bool
    resume_filename: Optional[str] = None
    skills_count: int = 0
    total_analyses: int = 0
    average_match: float = 0.0
    latest_match: Optional[float] = None
    latest_job_title: Optional[str] = None
    recent_analyses: List[dict] = []
