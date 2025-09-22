# 🌾 AgriSakha - Smart Agriculture Assistant

**Developed by Crop Bytes for Smart India Hackathon (SIH)**

AgriSakha is an intelligent agricultural advisory chatbot that helps farmers get real-time advice about crops, pests, fertilizers, and irrigation. It features voice input/output, multilingual support (English/Hindi), and image analysis capabilities.

## 🚀 Features

- **💬 Chatbot Interface**: Clean, user-friendly chat interface with agricultural theme
- **🎤 Voice Input**: Speech-to-text using Web Speech API
- **🔊 Voice Output**: Text-to-speech for accessibility
- **🌐 Multilingual**: English and Hindi support with seamless switching
- **📷 Image Analysis**: Upload crop/pest images for analysis
- **🤖 Smart AI**: Intelligent responses based on agricultural queries
- **📊 Query Logging**: Automatic logging of farmer queries for analysis
- **📱 Responsive**: Works on desktop and mobile devices

## 🏗️ Project Structure

```
AgriSakha/
├── backend/                 # FastAPI Backend
│   ├── main.py             # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── uploads/           # Image upload directory
│   └── queries.json       # Query log file (auto-generated)
│
├── frontend/               # React Frontend
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styled agriculture theme
│   │   └── index.js       # React entry point
│   └── package.json       # Node.js dependencies
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

### Quick Start Commands

1. **Start Backend:**
   ```powershell
   cd backend && uvicorn main:app --reload
   ```

2. **Start Frontend (in new terminal):**
   ```powershell
   cd frontend && npm start
   ```

3. **Open your browser to:** `http://localhost:3000`

### Using the Application

1. **Text Queries**: Type agricultural questions in the chat input
2. **Voice Input**: Click the microphone button to speak your query
3. **Language Toggle**: Switch between English and Hindi using the header button
4. **Image Upload**: Upload crop/pest images using the camera button
5. **Voice Output**: Click the speaker icon on bot responses to hear them

### Example Queries

**English:**
- "What is the best time to sow wheat?"
- "How to control pests in my crops?"
- "What fertilizer should I use for rice?"
- "When should I irrigate my field?"

**Hindi:**
- "गेहूं बोने का सबसे अच्छा समय क्या है?"
- "मेरी फसल में कीट कैसे नियंत्रित करें?"

## 🔧 API Endpoints

### Base URL: `http://localhost:8000`

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

## 🔮 Future Enhancements

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

1. **CORS Error:**
   - Ensure backend is running on port 8000
   - Check if CORS middleware is enabled in FastAPI

2. **Voice Recognition Not Working:**
   - Ensure you're using HTTPS or localhost
   - Check browser microphone permissions
   - Chrome/Edge recommended for best speech recognition

3. **Image Upload Fails:**
   - Check file format (only images allowed)
   - Ensure uploads/ directory exists in backend

4. **Port Already in Use:**
   ```powershell
   # Kill process on port 8000
   netstat -ano | findstr :8000
   taskkill /PID <PID_NUMBER> /F
   ```

## 📞 Support

For any issues or questions:
- **Team**: Crop Bytes
- **Project**: Smart India Hackathon (SIH)
- **Contact**: [Add your contact information]

## 📄 License

This project is developed for Smart India Hackathon 2025.

---

**Built with ❤️ by Crop Bytes Team for Indian Farmers** 🇮🇳