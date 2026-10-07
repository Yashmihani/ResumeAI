from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.nlp.preprocessing import clean_text
from app.nlp.skills import extract_skills, compare_skills

def calculate_match(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    NLP Matching Pipeline:
    1. Preprocess Resume text (cleaning, tokenization, stopword removal, lemmatization)
    2. Preprocess Job Description text
    3. Extract skills from both texts using predefined technical dictionary
    4. Compute TF-IDF Vectors across (1-gram, 2-gram)
    5. Calculate Cosine Similarity between vector representations:
       cosine(A, B) = (A · B) / (||A|| × ||B||)
    6. Combine textual cosine similarity with domain skill overlap:
       Match Score = 50% TF-IDF Cosine Similarity + 50% Skill Alignment
    7. Generate rule-based Viva recommendations:
       - 80% to 100%: Strong Match
       - 60% to 79%: Good Match
       - 40% to 59%: Moderate Match
       - Below 40%: Weak Match
    """
    clean_resume = clean_text(resume_text)
    clean_jd = clean_text(job_description)

    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    matched_skills, missing_skills = compare_skills(resume_skills, job_skills)

    if not clean_resume or not clean_jd:
        return {
            "match_score": 0.0,
            "cosine_score": 0.0,
            "skill_score": 0.0,
            "classification": "Weak Match",
            "recommendation": "Unable to compute similarity due to insufficient text content.",
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "resume_skills": resume_skills,
            "job_skills": job_skills,
        }

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([clean_resume, clean_jd])

    # Cosine Similarity
    raw_cosine = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
    raw_cosine_pct = round(max(0.0, min(100.0, raw_cosine * 100)), 1)

    # Skill match score
    if job_skills:
        skill_pct = round((len(matched_skills) / len(job_skills)) * 100, 1)
        # Weighted combination: 50% TF-IDF Cosine + 50% Skill Match
        composite_score = round(0.5 * raw_cosine_pct + 0.5 * skill_pct, 1)
    else:
        skill_pct = 0.0
        composite_score = raw_cosine_pct

    # Bound between 0 and 100
    final_score = max(0.0, min(100.0, composite_score))

    # Viva classification
    if final_score >= 80.0:
        classification = "Strong Match"
        recommendation = (
            "Your resume has a high textual similarity with the provided job description and "
            "contains most of the identified required skills. You are strongly aligned with this role."
        )
    elif final_score >= 60.0:
        classification = "Good Match"
        recommendation = (
            "Your resume demonstrates good alignment with the core requirements of this role. "
            "Adding a few missing domain-specific skills will further strengthen your application."
        )
    elif final_score >= 40.0:
        classification = "Moderate Match"
        recommendation = (
            "Your resume demonstrates moderate similarity. Consider incorporating missing keywords, "
            "frameworks, and projects aligned with the job description."
        )
    else:
        classification = "Weak Match"
        recommendation = (
            "Your resume has relatively low similarity with this position. Major required skills "
            "and domain qualifications appear to be missing."
        )

    return {
        "match_score": final_score,
        "cosine_score": raw_cosine_pct,
        "skill_score": skill_pct,
        "classification": classification,
        "recommendation": recommendation,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
    }
