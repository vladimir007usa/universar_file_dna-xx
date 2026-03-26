package com.filedna.controller;

import com.filedna.service.MetadataExtractor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * REST controller for file analysis.
 * Accepts multipart file uploads, extracts metadata via Tika,
 * and forwards to the Python logic engine for security scanning.
 */
@RestController
@RequestMapping("/api")
public class FileAnalysisController {

    private static final Logger log = LoggerFactory.getLogger(FileAnalysisController.class);

    private final MetadataExtractor metadataExtractor;
    private final RestTemplate restTemplate;

    @Value("${python.service.url:http://localhost:5000}")
    private String pythonServiceUrl;

    public FileAnalysisController(MetadataExtractor metadataExtractor, RestTemplate restTemplate) {
        this.metadataExtractor = metadataExtractor;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new LinkedHashMap<>();
        response.put("status", "healthy");
        response.put("service", "Universal File DNA — Middleware");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file provided."));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("fileName", file.getOriginalFilename());
        result.put("fileSize", file.getSize());
        result.put("uploadContentType", file.getContentType());

        try {
            // ── Step 1: Extract metadata with Tika ──
            log.info("Extracting metadata for: {}", file.getOriginalFilename());
            Map<String, Object> extraction = metadataExtractor.extract(
                file.getInputStream(), file.getOriginalFilename()
            );
            result.put("metadata", extraction.get("metadata"));
            result.put("detectedType", extraction.get("detectedType"));
            result.put("extractedText", truncateText((String) extraction.get("extractedText"), 5000));

            // ── Step 2: Forward to Python service for security analysis ──
            log.info("Forwarding metadata to logic engine at {}", pythonServiceUrl);
            Map<String, Object> securityResult = forwardToPythonService(extraction, file);
            result.put("securityAnalysis", securityResult);

        } catch (Exception e) {
            log.error("Error processing file: {}", e.getMessage(), e);
            result.put("error", "Processing failed: " + e.getMessage());

            // If Python service is unreachable, still return metadata
            if (!result.containsKey("securityAnalysis")) {
                Map<String, Object> fallback = new LinkedHashMap<>();
                fallback.put("error", "Logic engine unreachable: " + e.getMessage());
                fallback.put("risk_level", "UNKNOWN");
                result.put("securityAnalysis", fallback);
            }
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Forward extracted metadata to the Python FastAPI logic engine.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> forwardToPythonService(Map<String, Object> extraction, MultipartFile file) {
        try {
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("metadata", extraction.get("metadata"));
            requestBody.put("filename", file.getOriginalFilename());
            requestBody.put("content_type", file.getContentType());
            requestBody.put("extracted_text", truncateText((String) extraction.get("extractedText"), 5000));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                pythonServiceUrl + "/api/analyze",
                HttpMethod.POST,
                entity,
                Map.class
            );

            return response.getBody() != null ? response.getBody() : Map.of("error", "Empty response from logic engine");
        } catch (Exception e) {
            log.warn("Python service call failed: {}", e.getMessage());
            Map<String, Object> errorResult = new LinkedHashMap<>();
            errorResult.put("error", "Logic engine call failed: " + e.getMessage());
            errorResult.put("risk_level", "UNKNOWN");
            return errorResult;
        }
    }

    /**
     * Truncate extracted text to avoid oversized payloads.
     */
    private String truncateText(String text, int maxLength) {
        if (text == null) return "";
        if (text.length() <= maxLength) return text;
        return text.substring(0, maxLength) + "... [truncated]";
    }
}
