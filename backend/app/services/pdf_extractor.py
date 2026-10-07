import io
import pdfplumber
from pypdf import PdfReader

class PDFExtractionError(Exception):
    pass

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text content from uploaded PDF using pdfplumber with PyPDF fallback.
    Validates that meaningful, readable text is extracted.
    """
    if not file_bytes:
        raise PDFExtractionError("The uploaded file is empty.")

    extracted_pages = []

    # Attempt 1: pdfplumber (best for layout and clean text)
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            if len(pdf.pages) == 0:
                raise PDFExtractionError("The uploaded PDF has 0 pages.")
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    extracted_pages.append(text)
    except Exception as e:
        # Attempt 2: PyPDF fallback
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            if len(reader.pages) == 0:
                raise PDFExtractionError("The uploaded PDF has 0 pages.")
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_pages.append(text)
        except Exception as inner_e:
            raise PDFExtractionError(f"Could not read PDF file: {str(e)} / {str(inner_e)}")

    full_text = "\n\n".join(extracted_pages).strip()

    # Verify meaningful text extraction (at least 20 alphanumeric characters)
    if len(full_text) < 20 or not any(c.isalnum() for c in full_text):
        raise PDFExtractionError(
            "No extractable text was found in the PDF. "
            "The file may be a scanned image or empty. "
            "Please upload a text-based PDF resume."
        )

    return full_text
