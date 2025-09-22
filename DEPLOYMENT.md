# 🚀 AgriSakha Deployment Guide

## Hosting Options

### 🔧 Backend Hosting (FastAPI)

#### Option 1: Railway (Recommended - Free)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Import the `AgriSakha` repository
4. Select the `backend` folder as root directory
5. Railway will automatically detect Python and use `Procfile`
6. Your backend will be available at: `https://agrisakha-backend.up.railway.app`

#### Option 2: Render (Free)
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Create a new "Web Service"
4. Select the `AgriSakha` repository
5. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Your backend will be available at: `https://agrisakha-backend.onrender.com`

#### Option 3: Heroku (Free tier discontinued, but still viable)
1. Install Heroku CLI
2. Navigate to backend directory:
   ```bash
   cd backend
   heroku create agrisakha-backend
   git subtree push --prefix backend heroku main
   ```

### 🌐 Frontend Hosting (React)

#### Option 1: Vercel (Recommended - Free)
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import the `AgriSakha` repository
4. Set:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variable**: `REACT_APP_API_URL=https://your-backend-url`
5. Your frontend will be available at: `https://agrisakha.vercel.app`

#### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub account
3. Import the `AgriSakha` repository
4. Set:
   - **Base Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
   - **Environment Variable**: `REACT_APP_API_URL=https://your-backend-url`
5. Your frontend will be available at: `https://agrisakha.netlify.app`

#### Option 3: GitHub Pages
1. In your repository, go to Settings > Pages
2. Set source to "Deploy from a branch"
3. Select branch: `main`, folder: `/frontend/build`
4. Your site will be available at: `https://harshad2321.github.io/AgriSakha`

## 🔄 Deployment Steps

### Step 1: Deploy Backend First
1. Choose Railway or Render
2. Deploy the backend
3. Note down the backend URL (e.g., `https://agrisakha-backend.railway.app`)

### Step 2: Update Frontend Configuration
1. Update `.env.production` with your backend URL:
   ```
   REACT_APP_API_URL=https://your-backend-url
   ```

### Step 3: Deploy Frontend
1. Choose Vercel or Netlify
2. Set the environment variable `REACT_APP_API_URL` to your backend URL
3. Deploy the frontend

### Step 4: Test the Application
1. Visit your frontend URL
2. Test the chatbot functionality
3. Try voice input/output
4. Upload an image to test the backend integration

## 🛠️ Quick Deployment Commands

### For Railway (Backend):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway deploy
```

### For Vercel (Frontend):
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

## 🌐 Expected URLs

After deployment, you'll have:
- **Backend API**: `https://agrisakha-backend.railway.app`
- **Frontend App**: `https://agrisakha.vercel.app`
- **GitHub Repo**: `https://github.com/Harshad2321/AgriSakha`

## 📋 Environment Variables

### Backend (.env)
```
PORT=8000
CORS_ORIGINS=https://agrisakha.vercel.app,https://agrisakha.netlify.app
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://agrisakha-backend.railway.app
```

## 🔒 Security Notes

For production deployment:
1. Update CORS origins to specific domains
2. Add authentication if needed
3. Set up proper error logging
4. Configure rate limiting
5. Use environment variables for sensitive data

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update backend CORS settings
2. **Build Failures**: Check Node.js/Python versions
3. **API Not Found**: Verify backend URL in frontend config
4. **Voice Features**: Ensure HTTPS for speech APIs

### Logs:
- **Railway**: Check deployment logs in Railway dashboard
- **Vercel**: Check function logs in Vercel dashboard
- **Netlify**: Check deploy logs in Netlify dashboard

## 🎯 Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API endpoints working
- [ ] Voice features working (requires HTTPS)
- [ ] Image upload working
- [ ] Language switching working
- [ ] Mobile responsive design
- [ ] Error handling in place
- [ ] Performance optimized

## 📞 Support

For deployment issues:
- Check the hosting platform's documentation
- Review deployment logs
- Test API endpoints directly
- Verify environment variables

Your AgriSakha app is now ready for global access! 🌾🚀