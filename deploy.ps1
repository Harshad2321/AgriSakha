# AgriSakha Deployment Script for Windows PowerShell
# This script helps deploy the application to various platforms

Write-Host "🌾 AgriSakha Deployment Assistant" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Function to deploy to Vercel
function Deploy-Frontend-Vercel {
    Write-Host "📦 Deploying Frontend to Vercel..." -ForegroundColor Yellow
    Set-Location frontend
    
    # Install dependencies if not present
    if (!(Test-Path "node_modules")) {
        Write-Host "Installing dependencies..." -ForegroundColor Blue
        npm install
    }
    
    # Build the application
    Write-Host "Building application..." -ForegroundColor Blue
    npm run build
    
    # Deploy to Vercel
    if (Get-Command vercel -ErrorAction SilentlyContinue) {
        Write-Host "Deploying to Vercel..." -ForegroundColor Blue
        vercel --prod
    } else {
        Write-Host "❌ Vercel CLI not installed. Please install: npm install -g vercel" -ForegroundColor Red
        Write-Host "Then run: vercel --prod" -ForegroundColor Yellow
    }
    
    Set-Location ..
}

# Function to check backend deployment readiness
function Check-Backend-Readiness {
    Write-Host "🔍 Checking Backend Readiness..." -ForegroundColor Yellow
    Set-Location backend
    
    # Check if requirements.txt exists
    if (!(Test-Path "requirements.txt")) {
        Write-Host "❌ requirements.txt not found!" -ForegroundColor Red
        Set-Location ..
        return $false
    }
    
    # Check if main.py exists
    if (!(Test-Path "main.py")) {
        Write-Host "❌ main.py not found!" -ForegroundColor Red
        Set-Location ..
        return $false
    }
    
    # Check Python installation
    if (!(Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Python not installed!" -ForegroundColor Red
        Set-Location ..
        return $false
    }
    
    Write-Host "✅ Backend is ready for deployment!" -ForegroundColor Green
    Set-Location ..
    return $true
}

# Function to show deployment URLs
function Show-Deployment-Options {
    Write-Host ""
    Write-Host "🚀 Deployment Options:" -ForegroundColor Green
    Write-Host "=====================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend Deployment:" -ForegroundColor Cyan
    Write-Host "-------------------" -ForegroundColor Cyan
    Write-Host "🔸 Vercel: https://vercel.com/new/clone?repository-url=https://github.com/Harshad2321/AgriSakha/tree/main/frontend"
    Write-Host "🔸 Netlify: https://app.netlify.com/start/deploy?repository=https://github.com/Harshad2321/AgriSakha"
    Write-Host "🔸 GitHub Pages: Enable in repository settings"
    Write-Host ""
    Write-Host "Backend Deployment:" -ForegroundColor Cyan
    Write-Host "------------------" -ForegroundColor Cyan
    Write-Host "🔸 Railway: https://railway.app/new/template/python"
    Write-Host "🔸 Render: https://render.com/deploy?repo=https://github.com/Harshad2321/AgriSakha"
    Write-Host "🔸 Heroku: https://heroku.com/deploy?template=https://github.com/Harshad2321/AgriSakha"
    Write-Host ""
    Write-Host "Environment Variables:" -ForegroundColor Cyan
    Write-Host "---------------------" -ForegroundColor Cyan
    Write-Host "Frontend: REACT_APP_API_URL=<your-backend-url>"
    Write-Host "Backend: PORT=8000 (set automatically by most platforms)"
    Write-Host ""
}

# Function to open deployment URLs
function Open-Deployment-URLs {
    Write-Host "🌐 Opening deployment platforms..." -ForegroundColor Yellow
    
    # Open Vercel for frontend
    Start-Process "https://vercel.com/new/clone?repository-url=https://github.com/Harshad2321/AgriSakha/tree/main/frontend"
    
    # Open Railway for backend
    Start-Process "https://railway.app/new/template/python"
    
    Write-Host "✅ Deployment URLs opened in your browser!" -ForegroundColor Green
}

# Main menu
Write-Host ""
Write-Host "What would you like to do?" -ForegroundColor Yellow
Write-Host "1. Deploy Frontend to Vercel"
Write-Host "2. Check Backend Deployment Readiness"
Write-Host "3. Show Deployment Options & URLs"
Write-Host "4. Open Deployment URLs in Browser"
Write-Host "5. Exit"
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Deploy-Frontend-Vercel
    }
    "2" {
        Check-Backend-Readiness
    }
    "3" {
        Show-Deployment-Options
    }
    "4" {
        Open-Deployment-URLs
    }
    "5" {
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Deployment process completed!" -ForegroundColor Green
Write-Host "📖 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Blue