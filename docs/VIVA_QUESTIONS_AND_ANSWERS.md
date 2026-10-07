# College Viva & Presentation Guide — ResumeAI
## NLP-Based Resume Screening & Job Matching System

This guide prepares you for all questions that external examiners, professors, and technical evaluators may ask during your project viva examination.

---

## 1. Project Overview & Objective

### Q1: What is the objective of this project?
**Answer:**
The objective is to automate the initial stage of resume screening by comparing candidate resume PDFs against job descriptions using Natural Language Processing (NLP) techniques. The system parses unstructured resume text, standardizes and cleans it, extracts technical domain skills, converts text into numerical TF-IDF vectors, and computes Cosine Similarity to output an explainable match percentage and skill gap analysis.

### Q2: What is the core processing pipeline?
**Answer:**
```text
Resume PDF
     ↓
Text Extraction (pdfplumber)
     ↓
Text Cleaning (Lowercasing, Regex, URL removal)
     ↓
Tokenization (NLTK word_tokenize)
     ↓
Stopword Removal (NLTK English stopwords)
     ↓
Lemmatization (NLTK WordNetLemmatizer)
     ↓
Skill Extraction (Predefined Technical Dictionary)
     ↓
TF-IDF Vectorization (Scikit-learn TfidfVectorizer)
     ↓
Cosine Similarity (sklearn cosine_similarity)
     ↓
Match Score & Skill Gap Report (Matched vs Missing Skills)
```

---

## 2. Natural Language Processing (NLP) Concepts

### Q3: Why is Text Preprocessing necessary?
**Answer:**
Resumes and job postings contain unstructured text with varying cases, punctuation, formatting artifacts, and grammatical filler words. Preprocessing standardizes the vocabulary so that the mathematical vectorizer focuses strictly on substantive technical keywords rather than noise.

### Q4: Explain the difference between Stemming and Lemmatization. Why did you choose Lemmatization?
**Answer:**
- **Stemming** chops off word affixes using crude heuristic rules (e.g., "developer", "develops", "developing" become "develop"; but "university" might become "univers", which is not a valid word).
- **Lemmatization** uses vocabulary and morphological analysis (WordNet lexicon) to return the actual dictionary base form (known as the *lemma*).
- **Why Lemmatization:** In resume screening, semantic accuracy is crucial. Lemmatization ensures terms like "organizing", "organized", or "organize" reduce to the valid lemma "organize" without corrupting technical acronyms.

### Q5: What is TF-IDF and how is it calculated?
**Answer:**
**TF-IDF** stands for **Term Frequency - Inverse Document Frequency**. It reflects how important a word is to a specific document in a collection:

1. **Term Frequency (TF):**
   $$\text{TF}(t, d) = \frac{\text{Count of term } t \text{ in document } d}{\text{Total terms in document } d}$$
   Measures how frequently a term appears in the document.

2. **Inverse Document Frequency (IDF):**
   $$\text{IDF}(t, D) = \log\left(\frac{N}{|\{d \in D : t \in d\}|}\right)$$
   Penalizes words that appear everywhere across all documents and rewards terms unique to specific documents.

3. **TF-IDF Formula:**
   $$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

### Q6: What is Cosine Similarity and why is it preferred over Euclidean Distance?
**Answer:**
**Cosine Similarity** measures the cosine of the angle between two non-zero vectors in multi-dimensional space:
$$\text{Cosine Similarity}(A, B) = \frac{A \cdot B}{\|A\| \times \|B\|} = \frac{\sum_{i=1}^n A_i B_i}{\sqrt{\sum_{i=1}^n A_i^2} \times \sqrt{\sum_{i=1}^n B_i^2}}$$

- **Range:** Between $0$ (completely orthogonal / no overlap) and $1$ (identical orientation).
- **Why preferred over Euclidean Distance:**
  A resume might be 600 words long while a job description is only 80 words long. Euclidean distance measures the absolute geometric distance between vectors, so length disparity causes Euclidean distance to be very large even if the candidate has all the required skills. Cosine similarity evaluates the **angle (direction)** of the vectors, effectively normalizing for document length!

---

## 3. Skill Extraction & Scoring

### Q7: How does your Skill Extraction work?
**Answer:**
Skill extraction uses a curated dictionary of technical domains (Python, Java, React, SQL, Machine Learning, Docker, AWS, Kubernetes, etc.) with regular expressions that account for case variations, acronyms, and word boundaries (e.g., matching "C++" vs "C", or "Node.js" vs "Node"). Skills present in both resume and job description are marked as **Matched**, while job requirements absent from the resume are flagged as **Missing Skills**.

### Q8: Does your Match Score represent Model Accuracy?
**Answer (Very Important for Viva!):**
**No.** We clearly distinguish between **Similarity Score** and **Model Accuracy**.
Because this is an unsupervised NLP mini-project comparing two text documents without a labeled ground-truth training dataset of hiring outcomes, reporting "accuracy" would be statistically fabricated. The percentage represents **textual vector similarity and skill requirement alignment**.

---

## 4. Architecture & Database

### Q9: What database is used and what is the schema?
**Answer:**
We use **MySQL** with SQLAlchemy ORM:
1. `users`: Stores candidate identity, email, and bcrypt password hash.
2. `resumes`: Stores uploaded PDF metadata, file path, extracted raw text, and detected skill JSON.
3. `analyses`: Stores job description, calculated match score, matched skills, missing skills, and timestamp.

### Q10: How are passwords secured?
**Answer:**
Passwords are never stored in plain text. They are hashed using the standard **bcrypt** hashing algorithm with cryptographic salting. Authentication sessions are managed using stateless **JWT (JSON Web Tokens)** signed with an HMAC SHA-256 secret.

---

## 5. Limitations & Future Scope

### Q11: What are the current limitations of the system?
**Answer:**
1. **Bag-of-Words / TF-IDF limitation:** TF-IDF captures word frequency and n-grams but does not fully comprehend deep contextual semantics (e.g., "I do NOT know Python" has high keyword overlap with "Python required").
2. **Scanned PDFs:** Non-text scanned image PDFs require an OCR engine (such as Tesseract).
3. **Dictionary coverage:** Skill extraction depends on predefined vocabulary patterns.

### Q12: What is the future scope for this project?
**Answer:**
1. Integrating Transformer embeddings (Sentence-BERT or RoBERTa) for deep semantic embedding matching.
2. Named Entity Recognition (NER) models for automated dynamic skill discovery.
3. Candidate ranking and batch evaluation across multiple resume applicants.
