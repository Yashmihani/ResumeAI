# ResumeAI — NLP-Based Resume Screening and Job Matching System

> **College NLP Mini Project** — Department of Computer Science  
> TF-IDF Vectorization · Cosine Similarity · JWT Authentication · FastAPI · React 18

---

## Project Description

ResumeAI is a full-stack web application that compares an uploaded PDF resume against a job description using **Natural Language Processing** techniques. It extracts text from the PDF, preprocesses it through a standard NLP pipeline (tokenization, stopword removal, lemmatization), builds TF-IDF vectors for both documents, and computes the cosine similarity between them to produce a **match score (0–100)**.

The system also performs **pattern-based skill extraction** from a predefined technical skill dictionary and reports which job-required skills are present in (or missing from) the resume.

---

## Features

| Feature | Description |
|---|---|
| User registration & login | JWT-based authentication, bcrypt password hashing |
| PDF resume upload | Supports text-based PDFs up to 10 MB; auto-extracts text |
| NLP preprocessing | Lowercase → URL removal → tokenization → stopwords → lemmatization |
| Skill extraction | Pattern-matching against 35+ predefined technical skills |
| TF-IDF vectorization | Unigram + bigram TF-IDF representation (scikit-learn) |
| Cosine similarity | cos(θ) = (A · B) / (‖A‖ × ‖B‖), blended 50/50 with skill score |
| Match score | Composite 0–100 score with 4-tier classification |
| Candidate dashboard | Stats, NLP pipeline diagram, recent analyses |
| Analysis history | Searchable record of all past analyses stored in SQLite |
| Profile management | Name update; email shown as read-only identifier |

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, React Router v6, Lucide Icons |
| **Backend** | FastAPI (Python), Uvicorn ASGI server |
| **Database** | SQLite (`resume_ai.db`) via SQLAlchemy ORM |
| **Authentication** | JWT (`python-jose`), bcrypt (`passlib`) |
| **PDF Extraction** | pdfplumber (primary), pypdf (fallback) |
| **NLP** | NLTK (tokenization, stopwords, lemmatization), scikit-learn (TF-IDF, cosine similarity) |

---

## Project Structure

```
ResumeScreening/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── deps.py          # JWT dependency (get_current_user)
│   │   │   └── security.py      # bcrypt hashing, JWT encode/decode
│   │   ├── models/
│   │   │   ├── user.py          # SQLAlchemy User model
│   │   │   ├── resume.py        # SQLAlchemy Resume model
│   │   │   └── analysis.py      # SQLAlchemy Analysis model
│   │   ├── nlp/
│   │   │   ├── preprocessing.py # NLP text cleaning + NLTK resource bootstrap
│   │   │   ├── skills.py        # Pattern-based skill extractor
│   │   │   └── matcher.py       # TF-IDF + cosine similarity pipeline
│   │   ├── routes/
│   │   │   ├── auth.py          # POST /api/auth/register, /login, GET /me
│   │   │   ├── resumes.py       # POST /api/resumes/upload, GET /my, DELETE /{id}
│   │   │   ├── analysis.py      # POST /api/analysis/analyze, GET /dashboard, /history
│   │   │   └── users.py         # GET/PUT /api/users/me
│   │   ├── schemas/             # Pydantic request/response models
│   │   ├── services/
│   │   │   └── pdf_extractor.py # PDF text extraction service
│   │   ├── database.py          # SQLAlchemy engine + session factory
│   │   └── main.py              # FastAPI app, CORS, route registration
│   ├── uploads/resumes/         # Uploaded PDF files stored here
│   ├── resume_ai.db             # SQLite database file
│   ├── .env                     # Environment variables
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.js        # Axios instance with JWT interceptors
│   │   ├── components/          # Header, Sidebar, Layout, ProtectedRoute, NlpFlowDiagram
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # React auth state (login, register, logout)
│   │   └── pages/
│   │       ├── Landing.jsx      # Public landing page
│   │       ├── Login.jsx        # Login form
│   │       ├── Register.jsx     # Registration form
│   │       ├── Dashboard.jsx    # Candidate statistics + NLP pipeline diagram
│   │       ├── MyResume.jsx     # Resume upload and management
│   │       ├── Analyze.jsx      # Run NLP analysis, view match results
│   │       ├── History.jsx      # Past analyses with search
│   │       └── Profile.jsx      # Update candidate name
│   ├── package.json
│   └── vite.config.js           # Vite + proxy to backend :8000
├── docs/
│   └── VIVA_QUESTIONS_AND_ANSWERS.md
├── samples/                     # Sample PDF resumes for testing
├── run_backend.bat              # Windows: start FastAPI server
├── run_frontend.bat             # Windows: start Vite dev server
└── .env.example
```

---

## Backend Setup

### Prerequisites

- Python 3.10 or higher
- The virtual environment is already created at `venv/`

### Install dependencies (first time only)

```powershell
# From the project root
.\venv\Scripts\activate
pip install -r backend\requirements.txt
```

### Environment configuration

The backend reads from `backend\.env`. Default values work out of the box with SQLite:

```
DATABASE_URL=sqlite:///./resume_ai.db
JWT_SECRET=super-secret-college-nlp-jwt-key-2024-change-in-prod
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
UPLOAD_DIR=uploads/resumes
```

---

## Frontend Setup

### Prerequisites

- Node.js 18+ (with npm)
- `node_modules` is already installed in `frontend/`

### Install dependencies (first time only)

```powershell
cd frontend
npm install
```

---

## How to Start the Backend

### Option A — Use the batch file (recommended on Windows)

```
Double-click run_backend.bat
```

Or from PowerShell:

```powershell
.\run_backend.bat
```

### Option B — Manual start

```powershell
.\venv\Scripts\activate
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be available at: `http://127.0.0.1:8000`  
Interactive API docs: `http://127.0.0.1:8000/docs`

---

## How to Start the Frontend

### Option A — Use the batch file (recommended on Windows)

```
Double-click run_frontend.bat
```

Or from PowerShell:

```powershell
.\run_frontend.bat
```

### Option B — Manual start

```powershell
cd frontend
npx vite --port 3000
```

Frontend will be available at: `http://localhost:3000`

> **Important:** Start the backend **before** the frontend. The Vite dev server proxies `/api` requests to `http://127.0.0.1:8000`.

---

## Database Information

- **Engine:** SQLite (file-based, zero-configuration)
- **File:** `backend/resume_ai.db`
- **ORM:** SQLAlchemy 2.x (models auto-create tables on startup)

| Table | Contents |
|---|---|
| `users` | id, name, email, password_hash, created_at |
| `resumes` | id, user_id, filename, file_path, extracted_text, detected_skills, uploaded_at |
| `analyses` | id, user_id, resume_id, job_title, job_description, match_score, matched_skills, missing_skills, recommendation, created_at |

To switch to MySQL when a server is available, update `backend/.env`:

```
DATABASE_URL=mysql+pymysql://root:PASSWORD@localhost:3306/resume_ai
```

---

## NLP Pipeline

The core NLP analysis follows this 8-step pipeline:

```
PDF Upload
    │
    ▼
① PDF Text Extraction      pdfplumber → pypdf fallback
    │
    ▼
② Lowercase Conversion     text.lower()
    │
    ▼
③ URL / Email Removal      regex substitution
    │
    ▼
④ Technical Term Protection  C++ → cpp, C# → csharp, .NET → dotnet
    │
    ▼
⑤ Tokenization             NLTK word_tokenize()
    │
    ▼
⑥ Stopword Removal         NLTK english corpus
    │
    ▼
⑦ Lemmatization            NLTK WordNetLemmatizer
    │
    ▼
⑧ Skill Extraction         Regex pattern matching (35+ skills)
    │
    ▼
⑨ TF-IDF Vectorization     scikit-learn TfidfVectorizer (1-gram + 2-gram)
    │
    ▼
⑩ Cosine Similarity        cos(θ) = (A · B) / (‖A‖ × ‖B‖)
    │
    ▼
Match Score = 0.5 × TF-IDF Score + 0.5 × Skill Overlap Score
```

**Classification:**

| Score | Label |
|---|---|
| 80 – 100 | ✅ Strong Match |
| 60 – 79  | 🟢 Good Match |
| 40 – 59  | 🟡 Moderate Match |
| 0  – 39  | 🔴 Weak Match |

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/resumes/upload` | Yes | Upload PDF, extract text + skills |
| GET | `/api/resumes/my` | Yes | List user's resumes |
| GET | `/api/resumes/{id}` | Yes | Get resume detail with extracted text |
| DELETE | `/api/resumes/{id}` | Yes | Delete a resume |
| POST | `/api/analysis/analyze` | Yes | Run NLP match, save result |
| GET | `/api/analysis/dashboard` | Yes | Dashboard stats + recent analyses |
| GET | `/api/analysis/history` | Yes | Full analysis history |
| GET | `/api/analysis/{id}` | Yes | Single analysis detail |
| GET | `/api/users/me` | Yes | Get profile |
| PUT | `/api/users/me` | Yes | Update display name |

---

## Demo Workflow

1. Open `http://localhost:3000` — view the landing page
2. Click **Get Started** → Register with name, email, password
3. Navigate to **My Resume** → Upload a text-based PDF resume
4. Navigate to **Analyze Resume** → Select a sample job or paste a custom job description → click **Run NLP Analysis**
5. View the match score, matched skills, missing skills, and recommendation
6. Navigate to **History** to see all past analyses
7. Navigate to **Dashboard** to see cumulative statistics and the NLP pipeline diagram

Sample PDF resumes are provided in `samples/` for testing.

---

## Known Limitations

- **Image-based PDFs are not supported.** The system requires text-based (selectable) PDF files. Scanned documents will return an extraction error.
- **Skill dictionary is fixed.** The 35+ skills in `backend/app/nlp/skills.py` cover common tech roles. Niche or domain-specific skills not in the dictionary will not be detected.
- **SQLite concurrency.** SQLite handles single-user/low-concurrency usage well. For multi-user production deployment, switch to MySQL (see `.env` configuration above).
- **NLTK resources require internet on first run.** The backend auto-downloads `punkt`, `stopwords`, `wordnet`, and `omw-1.4` if they are missing. An internet connection is required the first time on a fresh machine.
- **No email verification.** Registration accepts any syntactically valid email without sending a verification message.
