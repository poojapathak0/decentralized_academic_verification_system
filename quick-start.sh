#!/bin/bash
# Quick Start Script for Decentralized Academic Verification System

echo "🎓 Decentralized Academic Verification System - Quick Start"
echo "==========================================================="
echo ""

# Check if backend is running
echo "📋 Checking backend connectivity..."
BACKEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)

if [ "$BACKEND_CHECK" = "200" ]; then
    echo "✅ Backend is running on http://localhost:5000"
else
    echo "⚠️  Backend not responding. Start it with: cd backend && npm run dev"
fi

echo ""

# Check if frontend is running
echo "📋 Checking frontend connectivity..."
if timeout 2 bash -c 'cat < /dev/null > /dev/tcp/127.0.0.1/5173' 2>/dev/null; then
    echo "✅ Frontend is running on http://localhost:5173"
else
    echo "⚠️  Frontend not responding. Start it with: npm run dev"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Click 'Get Started' to select a role (Verifier, Student, or Admin)"
echo "3. Connect your MetaMask wallet"
echo "4. Try the features for your role!"
echo ""
echo "📖 For detailed instructions, see COMPLETE_SETUP_GUIDE.md"
