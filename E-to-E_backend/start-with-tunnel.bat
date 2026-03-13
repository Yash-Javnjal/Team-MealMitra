@echo off
echo ============================================================
echo   MealMitra Backend + IoT Tunnel Startup
echo ============================================================
echo.
echo Starting localtunnel on fixed subdomain...
echo Your ESP32 devices should point to:
echo   https://mealmitra-iot-hub.loca.lt/api/iot/data
echo.
echo Starting backend server and tunnel in parallel...
echo ============================================================

start "MealMitra Tunnel" cmd /k "npx -y localtunnel --port 5000 --subdomain mealmitra-iot-hub --local-host 127.0.0.1"
timeout /t 3 /nobreak >nul
start "MealMitra Backend" cmd /k "cd /d D:\Team-MealMitra\E-to-E_backend && nodemon server.js"
