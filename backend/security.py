import re

PATTERNS = {
    "Email address": re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"),
    "Phone number": re.compile(r"(?<!\d)(?:\+?\d[\d\s().-]{8,}\d)(?!\d)"),
    "Internal IP": re.compile(r"\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b"),
    "API key / secret": re.compile(r"\b(?:sk-[A-Za-z0-9_-]{10,}|AKIA[0-9A-Z]{12,})\b"),
}

def scan_text(text: str):
    findings = []
    for label, pattern in PATTERNS.items():
        for m in pattern.finditer(text or ""):
            raw = m.group(0)
            masked = raw[:3] + "…" + raw[-2:] if len(raw) > 6 else "•••"
            findings.append({"type": label, "masked": masked, "severity": "medium"})
    return findings
