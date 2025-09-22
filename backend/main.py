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
    Enhanced AI logic for agricultural advisory with specific responses
    """
    query_lower = query.lower()
    
    # Wheat related queries
    if any(word in query_lower for word in ["wheat", "गेहूं", "gehu"]):
        if any(word in query_lower for word in ["disease", "बीमारी", "problem"]):
            return "Common wheat diseases: Rust, Blight. Use Propiconazole fungicide. Ensure proper crop rotation and avoid waterlogging."
        elif any(word in query_lower for word in ["fertilizer", "खाद"]):
            return "Wheat fertilizer schedule: Basal dose - DAP 100kg/acre, Urea 50kg/acre. Top dressing at 21 days - Urea 50kg/acre."
        else:
            return "Wheat cultivation tips: Sow in November, use certified seeds, maintain 20cm row spacing. Expected yield: 20-25 quintals/acre."
    
    # Rice related queries
    elif any(word in query_lower for word in ["rice", "धान", "चावल", "paddy"]):
        if any(word in query_lower for word in ["transplant", "रोपाई"]):
            return "Rice transplanting: Use 21-25 day old seedlings, maintain 2-3 seedlings per hill, 20x15cm spacing for better yield."
        elif any(word in query_lower for word in ["water", "पानी"]):
            return "Rice water management: Maintain 2-5cm standing water during vegetative stage. Drain before harvest."
        else:
            return "Rice cultivation: Best sowing June-July, use high-yielding varieties like Pusa Basmati, ensure proper puddling."
    
    # Pest related queries
    elif any(word in query_lower for word in ["pest", "insect", "bug", "कीट", "कीड़े"]):
        if any(word in query_lower for word in ["aphid", "माहू"]):
            return "Aphid control: Use Neem oil 3ml/liter or Imidacloprid 0.3ml/liter. Spray during evening hours."
        elif any(word in query_lower for word in ["bollworm", "caterpillar"]):
            return "Bollworm management: Use pheromone traps, spray Bt or Spinosad. Maintain field hygiene."
        else:
            return "Integrated Pest Management: Use yellow sticky traps, neem spray, encourage beneficial insects. Avoid repeated use of same pesticide."
    
    # Fertilizer queries
    elif any(word in query_lower for word in ["fertilizer", "खाद", "उर्वरक", "nutrition"]):
        if any(word in query_lower for word in ["organic", "जैविक"]):
            return "Organic fertilizers: Use farmyard manure 10-15 tons/acre, vermicompost 2-3 tons/acre, green manuring with dhaincha."
        elif any(word in query_lower for word in ["npk", "urea"]):
            return "NPK application: Soil test recommended. Generally use NPK 12:32:16 as basal, Urea for nitrogen top-dressing."
        else:
            return "Balanced fertilization: Apply based on soil test. Generally 120:60:40 NPK kg/ha for cereals. Use organic matter."
    
    # Irrigation queries
    elif any(word in query_lower for word in ["water", "irrigation", "सिंचाई", "पानी", "drip"]):
        if any(word in query_lower for word in ["drip", "ड्रिप"]):
            return "Drip irrigation benefits: 40-50% water saving, uniform distribution, reduced weed growth. Initial cost: ₹80,000-1,20,000/acre."
        elif any(word in query_lower for word in ["schedule", "timing"]):
            return "Irrigation scheduling: Critical stages - flowering, grain filling. Check soil moisture at 15cm depth."
        else:
            return "Efficient irrigation: Use mulching, check soil moisture before irrigation, avoid overwatering to prevent root rot."
    
    # Weather queries
    elif any(word in query_lower for word in ["weather", "rain", "मौसम", "बारिश", "climate"]):
        return f"Weather advisory for {location}: Monitor IMD forecasts, plan sowing/harvesting accordingly. Use weather-based crop advisory."
    
    # Soil related queries
    elif any(word in query_lower for word in ["soil", "मिट्टी", "testing", "ph"]):
        return "Soil management: Test soil every 2-3 years, maintain pH 6.0-7.5, add organic matter, practice crop rotation."
    
    # Market/price queries
    elif any(word in query_lower for word in ["price", "market", "कीमत", "बाजार", "sell"]):
        return "Market information: Check mandi prices on eNAM portal, consider storage if prices are low, maintain quality standards."
    
    # Seed related queries
    elif any(word in query_lower for word in ["seed", "variety", "बीज", "किस्म"]):
        return "Seed selection: Use certified/high-yielding varieties, treat seeds with fungicide, store in dry conditions."
    
    # General crop queries
    elif any(word in query_lower for word in ["crop", "farming", "खेती", "फसल"]):
        return "Smart farming practices: Crop rotation, integrated nutrient management, IPM, timely operations, record keeping."
    
    # Default response with more helpful content
    else:
        return f"Agricultural guidance: Please specify your query about crops, pests, fertilizers, irrigation, or weather. For {location} region, I can provide localized advice."

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