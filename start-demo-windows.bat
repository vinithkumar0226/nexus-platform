@echo off
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" python -m venv .venv
call ".venv\Scripts\activate.bat"
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
