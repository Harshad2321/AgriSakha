"""
Lightweight version of main.py for CI/CD testing that doesn't load heavy ML models.
This version focuses on testing the API structure and business logic.
"""

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from datetime import datetime
import uvicorn

app = FastAPI(title="AgriSakha API", version="1.0.0")

# Mock ML models for testing
qa_pipeline = None
disease_classifier = None

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "https://*.vercel.app",   # Vercel deployment
        "https://*.netlify.app",  # Netlify deployment
        "https://Harshad2321.github.io", # GitHub Pages
        "https://agrisakha.vercel.app", # Production frontend
        "https://agrisakha-frontend.netlify.app", # Alternative frontend
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
    
    # Default response
    else:
        return f"Agricultural guidance: Please specify your query about crops, pests, fertilizers, irrigation, or weather. For {location} region, I can provide localized advice."

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
    try:
        advice = get_dummy_ai_response(request.query, request.location)
        confidence = 0.8

        # Save log
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "query": request.query,
            "location": request.location,
            "language": request.language,
            "advice": advice
        }
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
            tts="dummy_audio_link",
            confidence=confidence
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing advisory: {str(e)}")

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)

        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # Mock image analysis
        disease_label = "Plant image uploaded successfully"
        confidence = 0.5
        advice = get_dummy_ai_response("general plant advice", "General")

        return {
            "filename": filename,
            "detected_disease": disease_label,
            "confidence": confidence,
            "analysis": f"Uploaded: {filename}",
            "recommendations": advice
        }

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
    uvicorn.run("main_ci:app", host="0.0.0.0", port=port, reload=False)