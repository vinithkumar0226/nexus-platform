from pathlib import Path
import hashlib
import re

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def extract_pdf(path: Path):
    import fitz
    doc = fitz.open(path)
    pages = []
    for i, page in enumerate(doc):
        text = page.get_text("text").strip()
        pages.append({"page": i + 1, "text": text})
    return pages

def extract_docx(path: Path):
    from docx import Document
    doc = Document(path)
    text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    return [{"page": 1, "text": text}]

def extract_txt(path: Path):
    return [{"page": 1, "text": path.read_text(encoding="utf-8", errors="ignore")}]

def extract_document(path: Path):
    ext = path.suffix.lower()
    if ext == ".pdf":
        return extract_pdf(path)
    if ext == ".docx":
        return extract_docx(path)
    if ext == ".txt":
        return extract_txt(path)
    raise ValueError("Unsupported file type. Use PDF, DOCX, or TXT.")

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()

def sentences(text: str):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", normalize(text)) if s.strip()]
