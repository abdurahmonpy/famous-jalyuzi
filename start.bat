@echo off
cd /d "%~dp0"
echo Sayt: http://localhost:8000   Admin: http://localhost:8000/admin/
start "" http://localhost:8000/admin/
python -m http.server 8000
