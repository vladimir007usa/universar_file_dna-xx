"""
main.py — Universal File DNA Logic Engine
FastAPI service that analyzes file metadata for security red flags.
Runs on port 5000.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import time

from scanner import scan_metadata

# ═══════════════════════════════════════════════════════════════════════════
# App Setup
# ═══════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="Universal File DNA — Logic Engine",
    description="Analyzes file metadata for security red flags using regex and YARA rules.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════════════════
# Models
# ═══════════════════════════════════════════════════════════════════════════

class AnalyzeRequest(BaseModel):
    metadata: Dict[str, Any]
    filename: Optional[str] = None
    content_type: Optional[str] = None
    extracted_text: Optional[str] = None


class AnalyzeResponse(BaseModel):
    red_flags: list
    risk_level: str
    total_flags: int
    scanners_used: list
    scan_duration_ms: float


# ═══════════════════════════════════════════════════════════════════════════
# Routes
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    return {
        "service": "Universal File DNA — Logic Engine",
        "status": "online",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_metadata(request: AnalyzeRequest):
    """
    Analyze extracted metadata for security red flags.
    Expects a JSON body with a 'metadata' dict.
    """
    if not request.metadata:
        raise HTTPException(status_code=400, detail="No metadata provided.")

    # Build a combined dict for scanning: metadata + text content
    combined: Dict[str, Any] = dict(request.metadata)
    if request.filename:
        combined["_filename"] = request.filename
    if request.content_type:
        combined["_content_type"] = request.content_type
    if request.extracted_text:
        combined["_extracted_text"] = request.extracted_text

    start = time.perf_counter()
    result = scan_metadata(combined)
    elapsed = (time.perf_counter() - start) * 1000  # ms

    return AnalyzeResponse(
        red_flags=result["red_flags"],
        risk_level=result["risk_level"],
        total_flags=result["total_flags"],
        scanners_used=result["scanners_used"],
        scan_duration_ms=round(elapsed, 2),
    )


# ═══════════════════════════════════════════════════════════════════════════
# Entry Point
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
