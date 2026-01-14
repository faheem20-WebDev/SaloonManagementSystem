@echo off
echo ===================================================
echo Starting Luxe Saloon System (Backend & Frontend)...
echo ===================================================

:: Start Backend in a new window
start "Luxe Backend (Port 5000)" cmd /k "cd backend && npm run dev"

:: Start Frontend in a new window
start "Luxe Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting...
echo Please wait for the browser to open or go to: http://localhost:5173
echo.
pause
