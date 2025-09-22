# Development Notes

## Project Overview
AgriSakha is a prototype agricultural advisory chatbot built for Smart India Hackathon.

## Technology Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React.js
- **AI**: Dummy logic (ready for ML model integration)
- **Voice**: Web Speech API & Speech Synthesis API

## Key Components

### Backend (FastAPI)
- `/advisory` - Text-based agricultural queries
- `/upload-image` - Image analysis for crops/pests
- `/queries` - Query history logging
- `/health` - Health check endpoint

### Frontend (React)
- Chatbot interface with agriculture theme
- Voice input/output capabilities
- Multilingual support (English/Hindi)
- Image upload functionality
- Responsive design

## Current Limitations
1. Uses dummy AI responses (not real ML models)
2. Limited translation dictionary
3. No user authentication
4. Local file storage only
5. No real-time weather integration

## Ready for Enhancement
The codebase is structured to easily integrate:
- Real ML models for crop/pest detection
- Advanced NLP for query understanding
- Database integration
- Weather API integration
- User management system

## Testing Scenarios
1. Text queries about wheat, rice, pests, fertilizers
2. Voice input in English and Hindi
3. Image upload for crop analysis
4. Language switching
5. Responsive design on mobile

## Performance Considerations
- Async FastAPI for scalability
- Image file size validation
- Query logging for analytics
- CORS enabled for cross-origin requests