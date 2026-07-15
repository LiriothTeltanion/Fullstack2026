@echo off
setlocal
cd /d "%~dp0"
py -3 tools\nova_ultimate.py --repo . --apply --yes --readmes all --delete-archives --run-tests --open
if errorlevel 1 python tools\nova_ultimate.py --repo . --apply --yes --readmes all --delete-archives --run-tests --open
pause
