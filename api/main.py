import os
import io
import time
import puremagic
import exifread
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

# Internal imports
try:
    from .scanner import scan_metadata
except ImportError:
    from scanner import scan_metadata

# Document Parsers
try:
    from pdfminer.high_level import extract_text as extract_pdf_text
except ImportError:
    extract_pdf_text = None

try:
    from docx import Document
except ImportError:
    Document = None

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None

app = FastAPI(title="Universal File DNA — Unified Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_metadata_python(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    metadata = {}
    extracted_text = ""
    
    metadata["resourceName"] = filename
    metadata["Content-Length"] = len(file_bytes)
    
    # MIME Type Detection (puremagic)
    mime = "application/octet-stream"
    try:
        ext_results = puremagic.from_string(file_bytes, mime=True)
        if ext_results:
            mime = ext_results
        metadata["Content-Type"] = mime
    except Exception as e:
        metadata["mime_error"] = str(e)

    # Type-Specific Extraction
    try:
        # Image EXIF
        if "image" in mime:
            tags = exifread.process_file(io.BytesIO(file_bytes))
            for tag, value in tags.items():
                if tag not in ('JPEGThumbnail', 'TIFFThumbnail', 'Filename', 'EXIF MakerNote'):
                    metadata[tag] = str(value)
        
        # PDF Text
        elif "pdf" in mime and extract_pdf_text:
            extracted_text = extract_pdf_text(io.BytesIO(file_bytes))
            metadata["pdf_parser"] = "pdfminer.six"
            
        # DOCX Text
        elif ("wordprocessingml" in mime or filename.endswith(".docx")) and Document:
            doc = Document(io.BytesIO(file_bytes))
            extracted_text = "\n".join([para.text for para in doc.paragraphs])
            metadata["docx_parser"] = "python-docx"
            
        # HTML Text
        elif ("html" in mime or filename.endswith((".html", ".htm"))) and BeautifulSoup:
            soup = BeautifulSoup(file_bytes, 'html.parser')
            extracted_text = soup.get_text()
            metadata["html_title"] = soup.title.string if soup.title else "No Title"

        # Plain Text
        elif "text" in mime or filename.endswith((".txt", ".md", ".json", ".py", ".js", ".java", ".ps1")):
            extracted_text = file_bytes.decode('utf-8', errors='ignore')

    except Exception as e:
        metadata["extraction_error"] = str(e)

    return {
        "metadata": metadata,
        "extractedText": extracted_text[:10000],
        "detectedType": mime
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "Universal File DNA — Unified Backend"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file provided.")

        start_time = time.perf_counter()
        file_bytes = await file.read()
        
        extraction = extract_metadata_python(file_bytes, file.filename)
        
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
    except Exception as e:
        logging.error(f"Upload failed: {str(e)}")
        return {
            "error": "Internal Server Error during analysis",
            "details": str(e),
            "securityAnalysis": {
                "risk_level": "UNKNOWN",
                "red_flags": []
            }
        }
