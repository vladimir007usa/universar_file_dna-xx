package com.filedna.service;

import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.xml.sax.ContentHandler;

import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Extracts all metadata from a file using Apache Tika.
 * Returns metadata as a flat String→String map plus extracted text content.
 */
@Service
public class MetadataExtractor {

    private final Tika tika = new Tika();

    /**
     * Extract metadata and text content from a file stream.
     *
     * @param inputStream  the file's input stream
     * @param fileName     original filename
     * @return map with "metadata" (Map) and "extractedText" (String)
     */
    public Map<String, Object> extract(InputStream inputStream, String fileName) throws Exception {
        Metadata metadata = new Metadata();
        metadata.set("resourceName", fileName);

        // BodyContentHandler with -1 = unlimited text extraction
        ContentHandler handler = new BodyContentHandler(-1);
        AutoDetectParser parser = new AutoDetectParser();
        ParseContext context = new ParseContext();

        parser.parse(inputStream, handler, metadata, context);

        // Collect all metadata fields
        Map<String, String> metaMap = new LinkedHashMap<>();
        for (String name : metadata.names()) {
            metaMap.put(name, metadata.get(name));
        }

        // Build result
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("metadata", metaMap);
        result.put("extractedText", handler.toString());
        result.put("detectedType", tika.detect(fileName));

        return result;
    }
}
