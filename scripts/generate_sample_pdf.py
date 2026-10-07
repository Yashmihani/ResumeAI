import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

def generate_pdf(filename: str, name: str, title: str, skills: list, summary: str, projects: list):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Header Banner
    c.setFillColor(colors.HexColor("#065f46")) # Emerald
    c.rect(0, height - 80, width, 80, fill=1, stroke=0)

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 40, name)
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 60, f"{title} | Email: {name.lower().replace(' ', '.')}@example.com")

    # Content
    y = height - 110
    c.setFillColor(colors.HexColor("#1e293b"))

    # Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "PROFESSIONAL SUMMARY")
    y -= 15
    c.setFont("Helvetica", 10)
    for line in summary.split("\n"):
        c.drawString(50, y, line)
        y -= 14

    y -= 10
    # Technical Skills
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "CORE TECHNICAL SKILLS")
    y -= 15
    c.setFont("Helvetica", 10)
    skill_text = ", ".join(skills)
    c.drawString(50, y, skill_text)
    y -= 25

    # Projects
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "KEY TECHNICAL PROJECTS")
    y -= 18

    for p in projects:
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, y, p["title"])
        y -= 14
        c.setFont("Helvetica", 9)
        for d in p["bullets"]:
            c.drawString(60, y, f"• {d}")
            y -= 13
        y -= 10

    # Education
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "EDUCATION")
    y -= 15
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "Bachelor of Technology in Computer Science & Engineering")
    y -= 14
    c.setFont("Helvetica", 9)
    c.drawString(50, y, "Relevant Coursework: NLP, Machine Learning, Database Management Systems, Data Structures")

    c.save()
    print(f"Generated sample PDF resume: {filename}")

if __name__ == "__main__":
    # Sample 1: Yash Mihani (Strong match for Python/ML/NLP)
    generate_pdf(
        "samples/Yash_Mihani_Resume.pdf",
        "Yash Mihani",
        "Machine Learning & Python Software Engineer",
        [
            "Python", "SQL", "MySQL", "Machine Learning", "Natural Language Processing",
            "NLP", "Scikit-learn", "Pandas", "NumPy", "Git", "GitHub", "Docker", "FastAPI"
        ],
        "Software engineering candidate with practical background in Python development,\n"
        "Machine Learning algorithms, and Natural Language Processing pipelines.\n"
        "Experienced in preprocessing unstructured text, vector representations, and building REST APIs.",
        [
            {
                "title": "NLP Resume Screening & Job Matching System",
                "bullets": [
                    "Engineered text extraction with pdfplumber and NLTK tokenization & lemmatization.",
                    "Generated TF-IDF matrices and evaluated cosine similarity to rank resume fit.",
                    "Implemented skill extraction dictionary and structured MySQL database schema."
                ]
            },
            {
                "title": "Machine Learning Predictive Modeling",
                "bullets": [
                    "Applied Scikit-learn, Pandas, and NumPy for feature engineering and predictive analysis.",
                    "Packaged applications using Docker containers and integrated Git version control."
                ]
            }
        ]
    )

    # Sample 2: Web Developer (Moderate match for Python jobs)
    generate_pdf(
        "samples/Web_Developer_Resume.pdf",
        "Alex Rivera",
        "Frontend & Full Stack Web Developer",
        ["React", "JavaScript", "HTML", "CSS", "Node.js", "SQL", "Git", "GitHub"],
        "Frontend developer specializing in building modern user interfaces using React\n"
        "and client-side JavaScript. Experienced in REST API integration and SQL databases.",
        [
            {
                "title": "Responsive Dashboard Web Application",
                "bullets": [
                    "Designed dynamic React single page application with Tailwind CSS.",
                    "Integrated Node.js backend services and SQL queries."
                ]
            }
        ]
    )

    # Sample 3: C++ & Java Systems (Weak match for Python ML)
    generate_pdf(
        "samples/Systems_Developer_Resume.pdf",
        "Priya Sharma",
        "Systems & Embedded Programmer",
        ["C", "C++", "Java", "Spring Boot", "Git"],
        "Systems programmer with strong foundational skills in C, C++, and object-oriented Java.\n"
        "Focus on algorithmic efficiency, operating systems, and memory management.",
        [
            {
                "title": "Embedded Device Controller",
                "bullets": [
                    "Developed low-level drivers in C and C++.",
                    "Utilized Git version control."
                ]
            }
        ]
    )
