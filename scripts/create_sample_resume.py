"""
Script to create sample candidate PDF resume for demonstration and testing.
Uses pypdf or standard PDF format.
"""
import os

def create_sample_pdf(output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # We can write a clean standard PDF 1.4 document directly
    content = """Yash Mihani - Software Engineer & Machine Learning Candidate
Email: yash.mihani@example.com | GitHub: github.com/yashm | Location: Mumbai, India

OBJECTIVE
Motivated Computer Science engineering student and developer passionate about Natural Language Processing, Machine Learning, and Full Stack development. Seeking software engineering opportunities to build scalable AI systems.

TECHNICAL SKILLS
- Programming Languages: Python, JavaScript, SQL, C++
- Machine Learning & NLP: Machine Learning, Natural Language Processing, NLP, Scikit-learn, Pandas, NumPy, TensorFlow
- Web & Backend: FastAPI, React, Node.js, HTML, CSS, REST API
- Databases & Tools: MySQL, Git, GitHub, Docker, MongoDB

EDUCATION
Bachelor of Technology in Computer Science & Engineering
Relevant Coursework: Natural Language Processing, Machine Learning, Database Management Systems, Data Structures & Algorithms

PROJECTS
1. NLP-Based Resume Screening and Job Matching System
- Built an automated resume screening system utilizing NLTK, TF-IDF vectorization, and Cosine Similarity.
- Implemented text preprocessing (tokenization, stopword removal, lemmatization) and technical skill extraction.
- Developed interactive web interface with React and FastAPI backend with MySQL storage.

2. Machine Learning Predictive Pipeline
- Developed classification and regression pipelines using Scikit-learn, Pandas, and NumPy.
- Trained models with cross-validation and evaluated precision, recall, and F1-score.

3. Full Stack Web Application
- Designed responsive interfaces using React, Tailwind CSS, and REST API endpoints.
- Managed user authentication with JWT and password hashing.
"""

    # Create a minimal valid PDF using PyPDF or ReportLab if available, or text file
    try:
        from pypdf import PageObject, PdfWriter
        # Since pypdf is a reader/writer rather than layout engine, let's test if reportlab is available
        # Or generate standard PDF text stream
    except Exception:
        pass

    # Standard clean text version
    txt_path = output_path.replace(".pdf", ".txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Sample resume text created at: {txt_path}")

if __name__ == "__main__":
    create_sample_pdf("samples/Yash_Mihani_Resume.pdf")
