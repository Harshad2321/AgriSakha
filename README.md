# 🌾 AgriSakha - Smart Agriculture Assistant

**Developed by Crop Bytes for Smart India Hackathon (SIH) 2025**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-brightgreen)](https://agrisakha.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/Harshad2321/AgriSakha)
[![Deploy](https://img.shields.io/badge/Deploy%20on-Vercel-blue)](https://vercel.com/new/clone?repository-url=https://github.com/Harshad2321/AgriSakha&project-name=agrisakha&framework=create-react-app&root-directory=frontend)

AgriSakha is an intelligent agricultural advisory chatbot that helps farmers get real-time advice about crops, pests, fertilizers, and irrigation. It features voice input/output, multilingual support (English/Hindi), image analysis capabilities, and works both online (AI mode) and offline (demo mode).

## 🔗 Live Demo

🌐 **Frontend**: https://agrisakha.vercel.app  
 **GitHub**: https://github.com/Harshad2321/AgriSakha  

> **✨ New**: The app now includes a **Demo Mode** that works even without a backend connection, providing sample agricultural advice!

## 🚀 Features

- **💬 Chatbot Interface**: Clean, user-friendly chat interface with agricultural theme
- **🎤 Voice Input**: Speech-to-text using Web Speech API (works in both modes)
- **🔊 Voice Output**: Text-to-speech for accessibility
- **🌐 Multilingual**: English and Hindi support with seamless switching
- **📷 Image Analysis**: Upload crop/pest images for analysis (AI mode) or demo simulation
- **🤖 Smart AI**: Intelligent responses based on agricultural queries (when backend available)
- **🎭 Demo Mode**: Provides sample agricultural content when offline
- **📊 Query Logging**: Automatic logging of farmer queries for analysis (AI mode)
- **📱 Responsive**: Works on desktop and mobile devices
- **⚡ Fast Loading**: Optimized build (~65KB gzipped)

## 🏗️ Project Structure

```
AgriSakha/
├── backend/                 # FastAPI Backend
│   ├── main.py             # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── test_import.py      # Backend testing script
│
├── frontend/               # React Frontend
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component with demo mode
│   │   ├── App.css        # Styled agriculture theme
│   │   └── index.js       # React entry point
│   ├── package.json       # Node.js dependencies
│   └── vercel.json        # Vercel deployment config
│
├── .github/workflows/     # CI/CD Pipeline
│   └── deploy.yml         # Automated testing and deployment
│
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)

### Backend Setup (FastAPI)

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server:**
   ```powershell
   uvicorn main:app --reload
   ```

   The backend will be available at: `http://localhost:8000`

### Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```powershell
   npm install
   ```

3. **Start the React development server:**
   ```powershell
   npm start
   ```

   The frontend will be available at: `http://localhost:3000`

## 🎯 Usage

### Live Demo
Visit the live application at: **https://agrisakha.vercel.app**

### Local Development

**Quick Start Commands:**

1. **Start Backend:**
   ```powershell
   cd backend && python main.py
   ```

2. **Start Frontend (in new terminal):**
   ```powershell
   cd frontend && npm start
   ```

3. **Open your browser to:** `http://localhost:3000`

> **Important**: For voice features to work locally, you may need to use HTTPS. The live demo has full voice functionality.

### Using the Application

**🎭 Demo Mode vs 🤖 AI Mode:**

The app automatically detects backend availability and switches between modes:

- **🤖 AI Mode** (when backend is connected): Full AI-powered responses with ML models
- **🎭 Demo Mode** (when backend is unavailable): Sample agricultural content for demonstration

**Features available in both modes:**
1. **Text Queries**: Type agricultural questions in the chat input
2. **Voice Input**: Click the microphone button to speak your query  
3. **Language Toggle**: Switch between English and Hindi using the header button
4. **Image Upload**: Upload crop/pest images (AI analysis or demo simulation)
5. **Voice Output**: Click the speaker icon on bot responses to hear them

**Connection Status:**
- 🟢 **AI Mode - Connected**: Full backend functionality
- 🟡 **Demo Mode**: Sample responses, perfect for demonstrations

### Example Queries

**English:**
- "What is the best time to sow wheat?"
- "How to control pests in my crops?"  
- "What fertilizer should I use for rice?"
- "When should I irrigate my field?"

**Hindi:**
- "गेहूं बोने का सबसे अच्छा समय क्या है?"
- "मेरी फसल में कीट कैसे नियंत्रित करें?"

**Demo Mode Sample Topics:**
- Wheat farming tips
- Rice cultivation advice
- Pest management
- Organic fertilizers

## 🔧 API Endpoints

### Base URLs
- **Local**: `http://localhost:8000`
- **Production**: `https://agrisakha-backend.railway.app`

#### 1. Agricultural Advisory
- **Endpoint**: `POST /advisory`
- **Body**:
  ```json
  {
    "query": "What fertilizer for wheat?",
    "location": "Delhi",
    "language": "English"
  }
  ```
- **Response**:
  ```json
  {
    "advice": "Best sowing time: November, use Urea 50kg/acre",
    "language": "English",
    "tts": "dummy_audio_link",
    "confidence": 0.85
  }
  ```

#### 2. Image Upload
- **Endpoint**: `POST /upload-image`
- **Body**: Form data with image file
- **Response**:
  ```json
  {
    "filename": "20241222_143022_crop.jpg",
    "analysis": "Crop appears healthy",
    "recommendations": "Continue current care routine",
    "confidence": 0.75
  }
  ```

#### 3. Query History
- **Endpoint**: `GET /queries`
- **Response**: List of all farmer queries with timestamps

#### 4. Health Check
- **Endpoint**: `GET /health`
- **Response**: Server health status

## 🧠 AI Logic

The current implementation uses **dummy AI logic** for demonstration:

### Query Processing:
- **Wheat queries** → Sowing time and fertilizer advice
- **Pest queries** → Pest identification and treatment
- **Rice queries** → Rice cultivation advice
- **Fertilizer queries** → NPK recommendations
- **Irrigation queries** → Water management tips
- **Weather queries** → Weather-based advice
- **Default** → General agricultural advice

### Multilingual Support:
- Basic translation dictionary for common responses
- Language detection and response in farmer's preferred language

## 🎨 UI/UX Features

### Agriculture Theme:
- **Primary Colors**: Various shades of green (#4CAF50, #8BC34A)
- **Accent Colors**: Earthy yellow (#FFC107) and brown (#8D6E63)
- **Design**: Clean, modern interface with nature-inspired colors

### Responsive Design:
- Mobile-friendly layout
- Touch-optimized buttons
- Adaptive text sizing

### Accessibility:
- Voice input/output for illiterate farmers
- High contrast colors
- Clear, readable fonts
- Simple navigation

## � Deployment

AgriSakha is ready for deployment on multiple platforms:

### 🌐 Live Deployment
- **Frontend**: Deployed on Vercel at https://agrisakha.vercel.app
- **Backend**: Deployed on Railway at https://agrisakha-backend.railway.app

### 📋 Hosting Options

**Backend (FastAPI):**
- Railway (Recommended) - Free tier available
- Render - Free tier available  
- Heroku - Paid plans
- Google Cloud Run - Pay per use

**Frontend (React):**
- Vercel (Recommended) - Free for personal projects
- Netlify - Free tier available
- GitHub Pages - Free for public repos
- AWS S3 + CloudFront - Pay per use

For detailed deployment instructions, see [`DEPLOYMENT.md`](DEPLOYMENT.md)

## �🔮 Future Enhancements

### AI Integration:
- Replace dummy logic with real ML models
- Crop disease detection using computer vision
- Weather API integration
- Soil analysis recommendations

### Features:
- Real-time weather updates
- Market price information
- Crop calendar reminders
- Community forum for farmers

### Technical:
- Database integration (PostgreSQL/MongoDB)
- User authentication and profiles
- SMS/WhatsApp integration
- Offline capability with PWA

## 🐛 Troubleshooting

### Common Issues:

1. **Voice Recognition Not Working:**
   - **Local**: Use HTTPS or try the live demo at https://agrisakha.vercel.app
   - **Browser**: Chrome/Edge recommended for best speech recognition
   - **Permissions**: Allow microphone access when prompted

2. **CORS Error:**
   - Ensure backend is running on port 8000
   - Check if CORS middleware is enabled in FastAPI

3. **Image Upload Fails:**
   - Check file format (only images allowed)
   - Ensure uploads/ directory exists in backend
   - File size should be reasonable (< 10MB)

4. **API Connection Issues:**
   - Verify backend is running
   - Check network connectivity
   - For production, ensure HTTPS URLs

5. **Port Already in Use:**
   ```powershell
   # Kill process on port 8000
   netstat -ano | findstr :8000
   taskkill /PID <PID_NUMBER> /F
   ```

### Voice Features Requirements:
- **HTTPS**: Required for microphone access in browsers
- **Modern Browser**: Chrome, Firefox, Safari, Edge
- **Permissions**: Allow microphone and speaker access
- **Network**: Stable internet connection for speech processing

## 📞 Support

For any issues or questions:
- **Team**: Crop Bytes
- **Project**: Smart India Hackathon (SIH)
- **Contact**: [Add your contact information]

## 📄 License

This project is developed for Smart India Hackathon 2025.

---

**Built with ❤️ by Crop Bytes Team for Indian Farmers** 🇮🇳