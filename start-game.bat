@echo off
echo Starting Skedaddle game server...
echo.
echo ===========================================
echo IMPORTANT: Due to browser security policies,
echo this game MUST be run from a local web server.
echo ===========================================
echo.
echo When the server starts, your browser will open automatically.
echo If it doesn't, go to: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server when you're done playing.
echo.

:: Try to open the browser automatically in 2 seconds
start "" cmd /c "timeout /t 2 >nul && start http://localhost:8000"

:: Check for Python
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
  echo Using Python to serve files...
  python -m http.server 8000
  goto :end
)

where python3 >nul 2>nul
if %ERRORLEVEL% equ 0 (
  echo Using Python3 to serve files...
  python3 -m http.server 8000
  goto :end
)

:: If Python isn't available, use Node's http-server if installed
where npx >nul 2>nul
if %ERRORLEVEL% equ 0 (
  echo Using Node's http-server...
  npx http-server -p 8000 --cors
  goto :end
)

:: No suitable server found
echo.
echo Error: Couldn't find Python or Node.js to start a server.
echo Please install Python or Node.js to run this game.
echo.
echo Alternatively, you can use any other local server solution:
echo - Visual Studio Code's "Live Server" extension
echo - XAMPP, WAMP, or similar local server solutions
echo.

:end
pause 