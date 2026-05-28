@echo off
REM Quick Start Script for Decentralized Academic Verification System (Windows)

echo.
echo 🎓 Decentralized Academic Verification System - Quick Start
echo ===========================================================
echo.

echo 📋 Checking backend connectivity...
timeout /t 1 /nobreak >nul

REM Check backend
powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:5000/health -TimeoutSec 2; if ($response.StatusCode -eq 200) { Write-Host '✅ Backend is running on http://localhost:5000' -ForegroundColor Green } } catch { Write-Host '⚠️  Backend not responding. Start it with: cd backend && npm run dev' -ForegroundColor Yellow }"

echo.
echo 📋 Checking frontend connectivity...
timeout /t 1 /nobreak >nul

REM Check frontend
powershell -Command "try { $socket = New-Object System.Net.Sockets.TcpClient; $socket.Connect('127.0.0.1', 5173); $socket.Close(); Write-Host '✅ Frontend is running on http://localhost:5173' -ForegroundColor Green } catch { Write-Host '⚠️  Frontend not responding. Start it with: npm run dev' -ForegroundColor Yellow }"

echo.
echo 🎯 Next Steps:
echo 1. Open http://localhost:5173 in your browser
echo 2. Click 'Get Started' to select a role (Verifier, Student, or Admin)
echo 3. Connect your MetaMask wallet
echo 4. Try the features for your role!
echo.
echo 📖 For detailed instructions, see COMPLETE_SETUP_GUIDE.md
echo.
pause
