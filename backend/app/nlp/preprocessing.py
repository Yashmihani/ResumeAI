import re
import nltk

# ---------------------------------------------------------------------------
# Defensive NLTK resource bootstrapping
# ---------------------------------------------------------------------------
# All required corpora are checked once at module load time.
# Only missing resources are downloaded — already-present ones are skipped.
# This prevents LookupError on fresh machines while avoiding repeated
# network calls on every request.
# ---------------------------------------------------------------------------

_NLTK_RESOURCES = [
    ("tokenizers/punkt",        "punkt"),
    ("tokenizers/punkt_tab",    "punkt_tab"),
    ("corpora/stopwords",       "stopwords"),
    ("corpora/wordnet",         "wordnet"),
    ("corpora/omw-1.4",         "omw-1.4"),
]

def ensure_nltk_resources() -> None:
    """Check each required NLTK resource and download it only if absent."""
    for resource_path, download_id in _NLTK_RESOURCES:
        try:
            nltk.data.find(resource_path)
        except LookupError:
            try:
                nltk.download(download_id, quiet=True)
            except Exception as exc:
                # Non-fatal: log and continue — fallbacks handle missing data
                print(f"[NLP] Warning: could not download NLTK resource '{download_id}': {exc}")

# Run once when the module is first imported
ensure_nltk_resources()

# ---------------------------------------------------------------------------
# Standard NLTK imports (safe after ensure_nltk_resources)
# ---------------------------------------------------------------------------
from nltk.corpus import stopwords as nltk_stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Initialize lemmatizer and stopwords once at module level
lemmatizer = WordNetLemmatizer()

try:
    stop_words = set(nltk_stopwords.words('english'))
except Exception:
    # Fallback: minimal English stopword set if corpus is still unavailable
    stop_words = {
        'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it',
        'they', 'them', 'what', 'which', 'who', 'is', 'are', 'was', 'were',
        'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
        'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can',
        'could', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'as', 'of',
        'at', 'by', 'for', 'with', 'to', 'in', 'on', 'that', 'this',
    }


def clean_text(text: str) -> str:
    """
    NLP Preprocessing Pipeline:
    1. Lowercase conversion
    2. URL & email removal
    3. Punctuation cleaning (preserving meaningful technical symbols like C++, C#, .NET)
    4. Tokenization
    5. Stopword removal
    6. Lemmatization
    7. Cleaned text reconstruction
    """
    if not text or not isinstance(text, str):
        return ""

    # Convert to lowercase
    text = text.lower()

    # Remove URLs and email addresses
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    text = re.sub(r'\S+@\S+', ' ', text)

    # Protect key programming terms before punctuation stripping
    text = re.sub(r'\bc\+\+\b', 'cpp', text, flags=re.IGNORECASE)
    text = re.sub(r'\bc#\b', 'csharp', text, flags=re.IGNORECASE)
    text = re.sub(r'\.net\b', 'dotnet', text, flags=re.IGNORECASE)

    # Replace special characters and punctuation with space, except alphanumeric
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)

    # Tokenize
    try:
        tokens = word_tokenize(text)
    except Exception:
        # Robust regex fallback if tokenizer encounters unexpected locale
        tokens = text.split()

    # Filter stopwords, short non-technical tokens, and perform lemmatization
    cleaned_tokens = []
    for token in tokens:
        token = token.strip()
        if len(token) > 1 and token not in stop_words:
            try:
                lemma = lemmatizer.lemmatize(token)
            except Exception:
                lemma = token  # Fallback: use raw token if lemmatizer fails
            cleaned_tokens.append(lemma)

    return " ".join(cleaned_tokens)
