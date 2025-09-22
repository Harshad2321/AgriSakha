#!/bin/bash

# AgriSakha Deployment Script
# This script helps deploy the application to various platforms

echo "🌾 AgriSakha Deployment Assistant"
echo "================================="

# Function to deploy to Vercel
deploy_frontend_vercel() {
    echo "📦 Deploying Frontend to Vercel..."
    cd frontend
    
    # Install dependencies if not present
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Build the application
    echo "Building application..."
    npm run build
    
    # Deploy to Vercel
    if command -v vercel &> /dev/null; then
        echo "Deploying to Vercel..."
        vercel --prod
    else
        echo "❌ Vercel CLI not installed. Please install: npm install -g vercel"
        echo "Then run: vercel --prod"
    fi
    
    cd ..
}

# Function to check backend deployment readiness
check_backend_readiness() {
    echo "🔍 Checking Backend Readiness..."
    cd backend
    
    # Check if requirements.txt exists
    if [ ! -f "requirements.txt" ]; then
        echo "❌ requirements.txt not found!"
        return 1
    fi
    
    # Check if main.py exists
    if [ ! -f "main.py" ]; then
        echo "❌ main.py not found!"
        return 1
    fi
    
    # Check Python installation
    if ! command -v python &> /dev/null; then
        echo "❌ Python not installed!"
        return 1
    fi
    
    echo "✅ Backend is ready for deployment!"
    cd ..
    return 0
}

# Function to show deployment URLs
show_deployment_options() {
    echo ""
    echo "🚀 Deployment Options:"
    echo "====================="
    echo ""
    echo "Frontend Deployment:"
    echo "-------------------"
    echo "🔸 Vercel: https://vercel.com/new/clone?repository-url=https://github.com/Harshad2321/AgriSakha/tree/main/frontend"
    echo "🔸 Netlify: https://app.netlify.com/start/deploy?repository=https://github.com/Harshad2321/AgriSakha"
    echo "🔸 GitHub Pages: Enable in repository settings"
    echo ""
    echo "Backend Deployment:"
    echo "------------------"
    echo "🔸 Railway: https://railway.app/new/template/python"
    echo "🔸 Render: https://render.com/deploy?repo=https://github.com/Harshad2321/AgriSakha"
    echo "🔸 Heroku: https://heroku.com/deploy?template=https://github.com/Harshad2321/AgriSakha"
    echo ""
    echo "Environment Variables:"
    echo "---------------------"
    echo "Frontend: REACT_APP_API_URL=<your-backend-url>"
    echo "Backend: PORT=8000 (set automatically by most platforms)"
    echo ""
}

# Main menu
echo ""
echo "What would you like to do?"
echo "1. Deploy Frontend to Vercel"
echo "2. Check Backend Deployment Readiness"
echo "3. Show Deployment Options & URLs"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_frontend_vercel
        ;;
    2)
        check_backend_readiness
        ;;
    3)
        show_deployment_options
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment process completed!"
echo "📖 For detailed instructions, see DEPLOYMENT.md"