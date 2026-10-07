from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ResumeBase(BaseModel):
    filename: str

class ResumeResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    skills_count: int
    detected_skills: List[str]

    class Config:
        from_attributes = True

class ResumeDetailResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    extracted_text: str
    detected_skills: List[str]
    uploaded_at: datetime

    class Config:
        from_attributes = True
