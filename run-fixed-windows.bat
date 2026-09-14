@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo Creating Python environment...
  py -3 -m venv .venv
)

echo Installing/verifying backend packages...
".venv\Scripts\python.exe" -m pip install -r backend\requirements.txt

start "SIH26154 BACKEND" cmd /k ""%~dp0.venv\Scripts\python.exe" -m uvicorn backend.app:app --host 0.0.0.0 --port 8000"
timeout /t 2 /nobreak >nul
start "SIH26154 FRONTEND" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
