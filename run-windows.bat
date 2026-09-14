@echo off
title SIH26154 - Trusted Content Transformation
cd /d "%~dp0"
echo.
echo ==========================================
echo   SIH26154  -  PREMIUM DEMO
echo ==========================================
echo.
if not exist ".venv\Scripts\python.exe" (
  echo Creating Python environment...
  python -m venv .venv
)
call ".venv\Scripts\activate.bat"
python -m pip install -r backend\requirements.txt
echo.
echo Starting SIH26154...
echo Open: http://localhost:8000
echo Team:  http://YOUR-LAPTOP-IP:8000
echo.
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
pause
