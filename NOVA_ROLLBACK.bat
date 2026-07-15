@echo off
setlocal
cd /d "%~dp0"
py -3 tools\nova_ultimate.py --repo . --rollback latest
if errorlevel 1 python tools\nova_ultimate.py --repo . --rollback latest
pause
