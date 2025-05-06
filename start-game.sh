#!/bin/bash

echo "Starting Skedaddle game server..."
echo
echo "=========================================="
echo "IMPORTANT: Due to browser security policies,"
echo "this game MUST be run from a local web server."
echo "=========================================="
echo
echo "When the server starts, your browser will open automatically."
echo "If it doesn't, go to: http://localhost:8000"
echo
echo "Press Ctrl+C to stop the server when you're done playing."
echo

# Try to open the browser automatically in 2 seconds
(sleep 2 && open "http://localhost:8000" || xdg-open "http://localhost:8000" || sensible-browser "http://localhost:8000" || python -m webbrowser -t "http://localhost:8000") &

# Check for Python
if command -v python3 &> /dev/null; then
  echo "Using Python3 to serve files..."
  python3 -m http.server 8000
  exit 0
fi

if command -v python &> /dev/null; then
  echo "Using Python to serve files..."
  python -m http.server 8000
  exit 0
fi

# If Python isn't available, use Node's http-server if installed
if command -v npx &> /dev/null; then
  echo "Using Node's http-server..."
  npx http-server -p 8000 --cors
  exit 0
fi

# No suitable server found
echo
echo "Error: Couldn't find Python or Node.js to start a server."
echo "Please install Python or Node.js to run this game."
echo
echo "Alternatively, you can use any other local server solution:"
echo "- Visual Studio Code's \"Live Server\" extension"
echo "- XAMPP, MAMP, or similar local server solutions"
echo

read -p "Press Enter to exit..." 