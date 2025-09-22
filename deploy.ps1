# AgriSakha Deployment Script for Windows PowerShell
# This script helps deploy the application to various platforms

Write-Host "AgriSakha Deployment Assistant" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Function to show deployment URLs
function Show-Deployment-Options {
    Write-Host ""
    Write-Host "Deployment Options:" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend Deployment:" -ForegroundColor Cyan
    Write-Host "-------------------" -ForegroundColor Cyan
    Write-Host "Vercel: https://vercel.com/new/clone?repository-url=https://github.com/Harshad2321/AgriSakha/tree/main/frontend"
    Write-Host "Netlify: https://app.netlify.com/start/deploy?repository=https://github.com/Harshad2321/AgriSakha"
    Write-Host "GitHub Pages: Enable in repository settings"
    Write-Host ""
    Write-Host "Backend Deployment:" -ForegroundColor Cyan
    Write-Host "------------------" -ForegroundColor Cyan
    Write-Host "Railway: https://railway.app/new/template/python"
    Write-Host "Render: https://render.com/deploy?repo=https://github.com/Harshad2321/AgriSakha"
    Write-Host "Heroku: https://heroku.com/deploy?template=https://github.com/Harshad2321/AgriSakha"
    Write-Host ""
    Write-Host "Environment Variables:" -ForegroundColor Cyan
    Write-Host "---------------------" -ForegroundColor Cyan
    Write-Host "Frontend: REACT_APP_API_URL=<your-backend-url>"
    Write-Host "Backend: PORT=8000 (set automatically by most platforms)"
    Write-Host ""
}

# Function to open deployment URLs
function Open-Deployment-URLs {
    Write-Host "Opening deployment platforms..." -ForegroundColor Yellow
    
    # Open Vercel for frontend
    Start-Process "https://vercel.com/new/clone?repository-url=https://github.com/Harshad2321/AgriSakha/tree/main/frontend"
    
    # Open Railway for backend
    Start-Process "https://railway.app/new/template/python"
    
    Write-Host "Deployment URLs opened in your browser!" -ForegroundColor Green
}

# Main menu
Write-Host ""
Write-Host "What would you like to do?" -ForegroundColor Yellow
Write-Host "1. Show Deployment Options & URLs"
Write-Host "2. Open Deployment URLs in Browser"
Write-Host "3. Exit"
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Show-Deployment-Options
    }
    "2" {
        Open-Deployment-URLs
    }
    "3" {
        Write-Host "Goodbye!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Deployment process completed!" -ForegroundColor Green
Write-Host "For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Blue