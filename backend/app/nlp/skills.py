import re
from typing import List, Set, Tuple

# Predefined skill dictionary as specified in Section 12
SKILL_PATTERNS = {
    "Python": [r"\bpython\b"],
    "Java": [r"\bjava\b(?!script)"],
    "JavaScript": [r"\bjavascript\b", r"\bjs\b"],
    "C": [r"\bc\b(?![+#])"],
    "C++": [r"\bc\+\+\b", r"\bcpp\b"],
    "React": [r"\breact\b", r"\breact\.?js\b"],
    "Node.js": [r"\bnode\b", r"\bnode\.?js\b"],
    "HTML": [r"\bhtml\b", r"\bhtml5\b"],
    "CSS": [r"\bcss\b", r"\bcss3\b"],
    "SQL": [r"\bsql\b"],
    "MySQL": [r"\bmysql\b"],
    "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
    "Machine Learning": [r"\bmachine\s+learning\b", r"\bml\b"],
    "Deep Learning": [r"\bdeep\s+learning\b", r"\bdl\b"],
    "Natural Language Processing": [r"\bnatural\s+language\s+processing\b"],
    "NLP": [r"\bnlp\b"],
    "TensorFlow": [r"\btensorflow\b", r"\btf\b"],
    "PyTorch": [r"\bpytorch\b"],
    "Scikit-learn": [r"\bscikit[- ]learn\b", r"\bsklearn\b"],
    "Pandas": [r"\bpandas\b"],
    "NumPy": [r"\bnumpy\b"],
    "Git": [r"\bgit\b"],
    "GitHub": [r"\bgithub\b"],
    "Docker": [r"\bdocker\b"],
    "AWS": [r"\baws\b", r"\bamazon\s+web\s+services\b"],
    "Azure": [r"\bazure\b"],
    "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
    "FastAPI": [r"\bfastapi\b"],
    "Django": [r"\bdjango\b"],
    "Spring Boot": [r"\bspring\s+boot\b", r"\bspringboot\b"],
    "REST API": [r"\brest\s+api\b", r"\brestful\b", r"\brest\s+apis\b"],
    "Blockchain": [r"\bblockchain\b"],
    "Solidity": [r"\bsolidity\b"]
}

def extract_skills(text: str) -> List[str]:
    """
    Extract skills from text by checking against the predefined skill dictionary.
    Returns a sorted list of unique recognized skill names.
    """
    if not text or not isinstance(text, str):
        return []

    found_skills: Set[str] = set()
    lowered_text = text.lower()

    for canonical_name, patterns in SKILL_PATTERNS.items():
        for pat in patterns:
            if re.search(pat, lowered_text, flags=re.IGNORECASE):
                found_skills.add(canonical_name)
                break

    return sorted(list(found_skills))

def compare_skills(resume_skills: List[str], job_skills: List[str]) -> Tuple[List[str], List[str]]:
    """
    Compare resume skills and job requirements.
    Returns: (matched_skills, missing_skills)
    """
    resume_set = set(resume_skills)
    job_set = set(job_skills)

    matched = sorted(list(job_set.intersection(resume_set)))
    missing = sorted(list(job_set.difference(resume_set)))

    return matched, missing
