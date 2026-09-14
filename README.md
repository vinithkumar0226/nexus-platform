# SIH26154 — Premium Final Prototype

## IMPORTANT
This version is intentionally **one application**:
- FastAPI serves the web UI
- FastAPI handles uploads
- PDF/DOCX/TXT processing is built in
- Content DNA works in local demo mode
- Executive Brief works in local demo mode
- Security scan works
- Hash-linked audit works
- No separate Next.js server is required

## Windows — easiest method

From this project folder, double-click:

`run-windows.bat`

Then open:

`http://localhost:8000`

## Manual method

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
```

## Upload

On the dashboard:
1. Click **Choose a file**.
2. Select PDF, DOCX or TXT.
3. Wait for **SOURCE RECEIVED ✓**.
4. Click **Build Content DNA**.
5. Click **Generate Executive Brief**.
6. Review.
7. Approve.
8. Show the Audit Trail.

The file picker is a native browser file input overlay; it does not depend on a JavaScript-generated click.

## Demo without selecting a file

Click **Try the included demo document**.

## Team laptops

Start the server on one laptop:

```powershell
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
```

Find its IPv4 address:

```powershell
ipconfig
```

Example:

`192.168.1.10`

Other teammates on the same Wi-Fi open:

`http://192.168.1.10:8000`

If Windows Firewall asks, allow Python on Private networks.

## Architecture for faculty explanation

SOURCE
→ SECURE INGESTION
→ CONTENT INTELLIGENCE
→ CONTENT DNA
→ TRANSFORMATION
→ VALIDATION / SECURITY
→ HUMAN REVIEW
→ AUDIT

The LLM is a replaceable processing component. The demo currently uses a deterministic local engine, so it can run without API credits. A connected model can be enabled later.

The audit implementation is a local hash-linked tamper-evident chain; it is not a production blockchain.
