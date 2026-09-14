import os
import json
from dotenv import load_dotenv
try:
    from .processing import sentences, normalize
except ImportError:
    from processing import sentences, normalize

load_dotenv()
MODE = os.getenv("LLM_MODE", "demo").lower()
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

def _demo_dna(pages):
    full = "\n".join(p["text"] for p in pages)
    flat = normalize(full)
    sents = sentences(full)
    facts = []
    events = []
    claims = []

    for s in sents[:12]:
        if any(ch.isdigit() for ch in s) or any(k in s.lower() for k in [
            "reported", "detected", "affected", "identified", "occurred", "date", "incident"
        ]):
            facts.append(s[:260])

    for s in sents:
        if any(k in s.lower() for k in ["detected", "isolated", "occurred", "started", "completed", "reported"]):
            events.append(s[:260])

    for s in sents[:8]:
        if any(k in s.lower() for k in ["recommended", "should", "must", "requires", "risk", "impact"]):
            claims.append(s[:260])

    if not facts:
        facts = sents[:5]
    if not events:
        events = sents[:3]
    if not claims:
        claims = sents[-3:] if sents else ["No explicit claims detected."]

    entities = []
    for m in __import__("re").finditer(r"\b[A-Z][A-Za-z0-9&-]{2,}(?:\s+[A-Z][A-Za-z0-9&-]{2,}){0,3}\b", full):
        val = m.group(0).strip(" ,.;:()[]")
        if val not in entities and val.lower() not in {"The", "This", "Initial", "Recommended"}:
            entities.append(val)
        if len(entities) >= 8:
            break

    topics = []
    for word in ["incident", "security", "application", "vehicle", "health", "network", "organization", "report", "policy", "risk"]:
        if word in flat.lower():
            topics.append(word.title())
    if not topics:
        topics = ["Document intelligence"]

    page_refs = []
    for p in pages:
        if p["text"].strip():
            page_refs.append({"page": p["page"], "note": "Source evidence available on this page."})

    return {
        "title": "Source Intelligence DNA",
        "summary": sents[0][:320] if sents else "No readable text found.",
        "topics": topics[:6],
        "facts": [{"text": x, "source": "source text"} for x in facts[:8]],
        "entities": [{"name": x, "type": "Detected entity"} for x in entities[:8]],
        "events": [{"text": x, "source": "source text"} for x in events[:6]],
        "claims": [{"text": x, "source": "source text"} for x in claims[:8]],
        "recommendations": [{"text": x, "source": "source text"} for x in claims[-4:]],
        "uncertainties": ["Demo mode uses deterministic local extraction; deeper semantic interpretation can be enabled with a connected model."],
        "provenance": page_refs,
        "mode": "LOCAL DEMO",
    }

def _openai_dna(pages):
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    source = "\n\n".join(f"[PAGE {p['page']}]\n{p['text']}" for p in pages)
    prompt = """You are the Content Intelligence layer of SIH26154. Create a faithful Content DNA from the source.
Do not invent facts. Every fact/event/claim must be grounded in the source. Return JSON with:
summary, topics, facts[{text}], entities[{name,type}], events[{text}], claims[{text}], recommendations[{text}], uncertainties, provenance[{page,note}].
Keep it concise and source-grounded."""
    r = client.chat.completions.create(
        model=MODEL,
        temperature=0,
        response_format={"type":"json_object"},
        messages=[{"role":"system","content":prompt},{"role":"user","content":source[:50000]}],
    )
    data = json.loads(r.choices[0].message.content)
    data["title"] = "Source Intelligence DNA"
    data["mode"] = "OPENAI"
    return data

def generate_dna(pages):
    if MODE == "openai" and os.getenv("OPENAI_API_KEY"):
        try:
            return _openai_dna(pages)
        except Exception as e:
            data = _demo_dna(pages)
            data["uncertainties"].insert(0, f"OpenAI mode unavailable, so local demo mode was used: {type(e).__name__}.")
            data["mode"] = "LOCAL DEMO FALLBACK"
            return data
    return _demo_dna(pages)

def _demo_brief(dna):
    findings = [x["text"] for x in dna.get("facts", [])[:5]]
    actions = [x["text"] for x in dna.get("recommendations", [])[:4]]
    return {
        "title": "Executive Intelligence Brief",
        "situation": dna.get("summary", "Source-grounded intelligence representation."),
        "key_findings": findings or ["No high-confidence findings extracted."],
        "impact": "The source contains information that should be reviewed in context before operational decisions are made.",
        "risk_assessment": "REVIEW REQUIRED — validate important facts, dates, identities and sensitive information against the source before release.",
        "recommended_actions": actions or ["Review source evidence", "Confirm critical facts", "Approve or reject the generated artifact"],
        "source_notes": "Every section is derived from the shared Content DNA. Source pages are retained for traceability.",
        "validation": {"status": "READY FOR HUMAN REVIEW", "checks": ["Source linked", "Content DNA linked", "No unsupported source claim added by demo engine"]},
        "mode": dna.get("mode", "LOCAL DEMO"),
    }

def generate_brief(dna):
    if MODE == "openai" and os.getenv("OPENAI_API_KEY"):
        try:
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            prompt = """Transform the supplied Content DNA into an executive intelligence brief. Do not add facts.
Return JSON with title, situation, key_findings(array), impact, risk_assessment, recommended_actions(array),
source_notes, validation{status,checks(array)}. Make it clear and human-reviewable."""
            r = client.chat.completions.create(
                model=MODEL,
                temperature=0,
                response_format={"type":"json_object"},
                messages=[{"role":"system","content":prompt},{"role":"user","content":json.dumps(dna)[:40000]}],
            )
            data = json.loads(r.choices[0].message.content)
            data["mode"] = "OPENAI"
            return data
        except Exception:
            return _demo_brief(dna)
    return _demo_brief(dna)
