from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from datetime import datetime
import uvicorn

app = FastAPI(title="AgriSakha API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "https://*.vercel.app",   # Vercel deployment
        "https://*.netlify.app",  # Netlify deployment
        "*"  # Allow all origins for demo (restrict in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class AdvisoryRequest(BaseModel):
    query: str
    location: str = "Delhi"  # Default location
    language: str = "English"

class AdvisoryResponse(BaseModel):
    advice: str
    language: str
    tts: str
    confidence: float = 0.8

# Simple translation dictionary for multilingual support
translations = {
    "Best sowing time: November, use Urea 50kg/acre": {
        "Hindi": "सर्वोत्तम बुआई का समय: नवंबर, यूरिया 50 किग्रा/एकड़ का उपयोग करें"
    },
    "Possible pest detected: Aphids, use Neem spray": {
        "Hindi": "संभावित कीट पाया गया: एफिड्स, नीम स्प्रे का उपयोग करें"
    },
    "General advice: Maintain proper irrigation and soil testing.": {
        "Hindi": "सामान्य सलाह: उचित सिंचाई और मिट्टी परीक्षण बनाए रखें।"
    }
}

def get_dummy_ai_response(query: str, location: str) -> str:
    """
    Dummy AI logic for agricultural advisory
    """
    query_lower = query.lower()
    
    # Wheat related queries
    if any(word in query_lower for word in ["wheat", "गेहूं", "gehu"]):
        return "Best sowing time: November, use Urea 50kg/acre"
    
    # Pest related queries
    elif any(word in query_lower for word in ["pest", "insect", "bug", "कीट", "कीड़े"]):
        return "Possible pest detected: Aphids, use Neem spray"
    
    # Rice related queries
    elif any(word in query_lower for word in ["rice", "धान", "चावल"]):
        return "Rice cultivation: Best time June-July, ensure proper water management"
    
    # Fertilizer queries
    elif any(word in query_lower for word in ["fertilizer", "खाद", "उर्वरक"]):
        return "Use NPK 10:26:26 for better yield, apply according to soil test"
    
    # Irrigation queries
    elif any(word in query_lower for word in ["water", "irrigation", "सिंचाई", "पानी"]):
        return "Maintain proper irrigation schedule, avoid overwatering"
    
    # Weather queries
    elif any(word in query_lower for word in ["weather", "rain", "मौसम", "बारिश"]):
        return "Check weather forecast regularly, plan activities accordingly"
    
    # Default response
    else:
        return "General advice: Maintain proper irrigation and soil testing."

def translate_text(text: str, target_language: str) -> str:
    """
    Simple translation using dictionary mapping
    """
    if target_language == "Hindi" and text in translations:
        return translations[text].get("Hindi", text)
    return text

@app.get("/")
async def root():
    return {
        "message": "Welcome to AgriSakha API", 
        "version": "1.0.0",
        "endpoints": ["/advisory", "/upload-image", "/health"]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/advisory", response_model=AdvisoryResponse)
async def get_advisory(request: AdvisoryRequest):
    """
    Get agricultural advisory based on farmer's query
    """
    try:
        # Get AI response
        advice = get_dummy_ai_response(request.query, request.location)
        
        # Translate if needed
        if request.language == "Hindi":
            advice = translate_text(advice, "Hindi")
        
        # Log query for future analysis
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "query": request.query,
            "location": request.location,
            "language": request.language,
            "advice": advice
        }
        
        # Save to log file
        log_file = "queries.json"
        try:
            with open(log_file, "r") as f:
                logs = json.load(f)
        except FileNotFoundError:
            logs = []
        
        logs.append(log_entry)
        
        with open(log_file, "w") as f:
            json.dump(logs, f, indent=2)
        
        return AdvisoryResponse(
            advice=advice,
            language=request.language,
            tts="dummy_audio_link",  # Placeholder for TTS
            confidence=0.85
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing advisory: {str(e)}")

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload crop/pest image for analysis
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Dummy image analysis
        analysis_result = {
            "filename": filename,
            "file_path": file_path,
            "size": len(content),
            "analysis": "Dummy analysis: Image uploaded successfully. Crop appears healthy.",
            "recommendations": "Continue current care routine, monitor for pest activity",
            "confidence": 0.75
        }
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

@app.get("/queries")
async def get_query_history():
    """
    Get history of farmer queries for analysis
    """
    try:
        with open("queries.json", "r") as f:
            logs = json.load(f)
        return {"queries": logs, "total": len(logs)}
    except FileNotFoundError:
        return {"queries": [], "total": 0}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)