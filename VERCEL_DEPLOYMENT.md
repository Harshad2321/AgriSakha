# 🚀 Vercel Deployment Guide for AgriSakha

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Easiest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Harshad2321/AgriSakha&project-name=agrisakha&framework=create-react-app&root-directory=frontend)

### Option 2: Manual Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from frontend directory**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Set up environment variables** (if needed)
   ```bash
   vercel env add REACT_APP_API_URL
   ```

## Auto-Deploy Setup

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`
   - Set **Framework Preset** to `Create React App`

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

## Environment Variables for Production

Add these in Vercel Dashboard:

```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## Backend Deployment (Railway)

Your backend is already configured for Railway. Deploy backend separately:

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Railway will auto-detect Python and deploy

## URLs After Deployment

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.railway.app`

## Why Vercel?

✅ **Automatic deployments** from GitHub  
✅ **Global CDN** for fast loading  
✅ **Zero configuration** for React apps  
✅ **Free tier** with generous limits  
✅ **Custom domains** support  
✅ **Preview deployments** for pull requests  

## Current Status

- ✅ **GitHub Actions**: Tests backend and builds frontend
- ✅ **Vercel Ready**: Optimized configuration  
- ✅ **Railway Ready**: Backend deployment configured
- ✅ **Production Ready**: All files optimized