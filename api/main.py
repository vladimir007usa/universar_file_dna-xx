import os
import io
import time
import magic
import exifread
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from pydantic import BaseModel

# Internal imports
from scanner import scan_metadata

# Document Parsers
from pdfminer.high_level import extract_text as extract_pdf_text
from docx import Document
from bs4 import BeautifulSoup

app = FastAPI(title="Universal File DNA — Unified Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_metadata_python(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Python-native replacement for Apache Tika.
    Extracts metadata and text content from various file types.
    """
    metadata = {}
    extracted_text = ""
    
    # 1. Basic Info
    metadata["resourceName"] = filename
    metadata["Content-Length"] = len(file_bytes)
    
    # 2. MIME Type Detection (python-magic)
    try:
        mime = magic.from_buffer(file_bytes, mime=True)
        metadata["Content-Type"] = mime
    except Exception as e:
        metadata["mime_error"] = str(e)
        mime = "application/octet-stream"

    # 3. Type-Specific Extraction
    try:
        if "image" in mime:
            # EXIF extraction
            tags = exifread.process_file(io.BytesIO(file_bytes))
            for tag, value in tags.items():
                if tag not in ('JPEGThumbnail', 'TIFFThumbnail', 'Filename', 'EXIF MakerNote'):
                    metadata[tag] = str(value)
        
        elif "pdf" in mime:
            # PDF text extraction
            extracted_text = extract_pdf_text(io.BytesIO(file_bytes))
            metadata["pdf_parser"] = "pdfminer.six"
            
        elif "wordprocessingml" in mime or filename.endswith(".docx"):
            # DOCX extraction
            doc = Document(io.BytesIO(file_bytes))
            extracted_text = "\n".join([para.text for para in doc.paragraphs])
            metadata["docx_parser"] = "python-docx"
            
        elif "html" in mime or filename.endswith((".html", ".htm")):
            # HTML extraction
            soup = BeautifulSoup(file_bytes, 'html.parser')
            extracted_text = soup.get_text()
            metadata["html_title"] = soup.title.string if soup.title else "No Title"

        elif "text" in mime or filename.endswith((".txt", ".md", ".json", ".py", ".js", ".java", ".ps1")):
            # Plain text
            extracted_text = file_bytes.decode('utf-8', errors='ignore')

    except Exception as e:
        metadata["extraction_error"] = str(e)

    return {
        "metadata": metadata,
        "extractedText": extracted_text[:10000],  # Limit text size
        "detectedType": mime
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "Universal File DNA — Unified Backend"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Unified endpoint that replaces the Java /api/upload and 
    immediately performs security analysis.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file provided.")

    start_time = time.perf_counter()
    file_bytes = await file.read()
    
    # Step 1: Extract Metadata (Native Python)
    extraction = extract_metadata_python(file_bytes, file.filename)
    
    # Step 2: Security Analysis
    combined_for_scan = dict(extraction["metadata"])
    combined_for_scan["_filename"] = file.filename
    combined_for_scan["_content_type"] = extraction["detectedType"]
    combined_for_scan["_extracted_text"] = extraction["extractedText"]

    scan_result = scan_metadata(combined_for_scan)
    elapsed_ms = (time.perf_counter() - start_time) * 1000

    return {
        "fileName": file.filename,
        "fileSize": len(file_bytes),
        "detectedType": extraction["detectedType"],
        "metadata": extraction["metadata"],
        "extractedText": extraction["extractedText"][:5000],
        "securityAnalysis": {
            **scan_result,
            "scan_duration_ms": round(elapsed_ms, 2)
        }
    }

# Vercel entry point (optional, depends on vercel.json)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
