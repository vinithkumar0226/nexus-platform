from pathlib import Path
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

try:
    from .processing import sha256_file, extract_document
    from .security import scan_text
    from .audit import add_event, get_chain
    from .llm import generate_dna, generate_brief
except ImportError:
    from processing import sha256_file, extract_document
    from security import scan_text
    from audit import add_event, get_chain
    from llm import generate_dna, generate_brief

load_dotenv()

BASE = Path(__file__).resolve().parent.parent
STORAGE = BASE / "storage"
FRONTEND = BASE / "frontend"
STORAGE.mkdir(exist_ok=True)

app = FastAPI(title="SIH26154 — Content Transformation & Assurance", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB = {}

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "SIH26154 API", "mode": "local-demo"}

@app.get("/api/state")
def state():
    return {"sources": len(DB), "audit_events": len(get_chain())}

@app.get("/api/upload-test")
def upload_test():
    return {
        "status": "ready",
        "upload_control": "native-file-picker-enabled",
        "endpoint": "/api/sources/upload",
        "accepted_types": ["pdf", "docx", "txt"],
        "max_mb": 20,
    }

@app.post("/api/sources/upload")
async def upload(file: UploadFile = File(...)):
    if not file or not file.filename:
        raise HTTPException(400, "No file was selected.")
    ext = Path(file.filename).suffix.lower()
    if ext not in {".pdf", ".docx", ".txt"}:
        raise HTTPException(400, "Use PDF, DOCX, or TXT.")
    data = await file.read()
    if len(data) > 20 * 1024 * 1024:
        raise HTTPException(413, "Maximum file size is 20 MB.")

    source_id = str(uuid.uuid4())
    path = STORAGE / f"{source_id}{ext}"
    path.write_bytes(data)

    try:
        pages = extract_document(path)
    except Exception as e:
        path.unlink(missing_ok=True)
        raise HTTPException(400, f"Could not read document: {e}")

    full = "\n".join(p["text"] for p in pages)
    findings = scan_text(full)
    DB[source_id] = {
        "id": source_id,
        "filename": file.filename,
        "sha256": sha256_file(path),
        "pages": pages,
        "security": findings,
        "dna": None,
        "brief": None,
        "approved": False,
    }
    add_event("SOURCE_INGESTED", source_id, {
        "filename": file.filename,
        "sha256": DB[source_id]["sha256"],
        "pages": len(pages),
        "security_findings": len(findings),
    })
    return {"source_id": source_id, "filename": file.filename, "pages": len(pages), "sha256": DB[source_id]["sha256"], "security_findings": len(findings), "security": findings}

@app.get("/api/sources/{source_id}")
def get_source(source_id: str):
    if source_id not in DB:
        raise HTTPException(404, "Source not found")
    s = DB[source_id]
    return {
        "id": s["id"], "filename": s["filename"], "sha256": s["sha256"],
        "pages": len(s["pages"]), "security": s["security"],
        "dna": s["dna"], "brief": s["brief"], "approved": s["approved"],
    }

@app.post("/api/sources/{source_id}/analyze")
def analyze(source_id: str):
    if source_id not in DB:
        raise HTTPException(404, "Source not found")
    s = DB[source_id]
    s["dna"] = generate_dna(s["pages"])
    add_event("CONTENT_DNA_CREATED", source_id, {
        "facts": len(s["dna"].get("facts", [])),
        "entities": len(s["dna"].get("entities", [])),
        "events": len(s["dna"].get("events", [])),
        "claims": len(s["dna"].get("claims", [])),
        "mode": s["dna"].get("mode"),
    })
    return {"dna": s["dna"]}

@app.post("/api/sources/{source_id}/transform")
def transform(source_id: str):
    if source_id not in DB:
        raise HTTPException(404, "Source not found")
    s = DB[source_id]
    if not s["dna"]:
        raise HTTPException(400, "Build Content DNA first.")
    s["brief"] = generate_brief(s["dna"])
    add_event("ARTIFACT_GENERATED", source_id, {"type": "Executive Intelligence Brief", "mode": s["brief"].get("mode")})
    return {"brief": s["brief"]}

@app.post("/api/sources/{source_id}/approve")
def approve(source_id: str):
    if source_id not in DB:
        raise HTTPException(404, "Source not found")
    s = DB[source_id]
    if not s["brief"]:
        raise HTTPException(400, "Generate the brief first.")
    s["approved"] = True
    add_event("HUMAN_APPROVAL", source_id, {"artifact": "Executive Intelligence Brief", "decision": "APPROVED"})
    return {"approved": True}

@app.get("/api/audit")
def audit():
    return {"events": get_chain()}

@app.get("/")
def home():
    return FileResponse(FRONTEND / "index.html", headers={"Cache-Control": "no-store"})

app.mount("/static", StaticFiles(directory=FRONTEND), name="static")
