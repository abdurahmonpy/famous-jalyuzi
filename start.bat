@echo off
cd /d "%~dp0"
echo Sayt: http://localhost:8000   Admin: http://localhost:8000/admin.html
start "" http://localhost:8000/admin.html
python -m http.server 8000
