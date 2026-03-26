package com.filedna;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Universal File DNA — Middleware Service
 * Accepts file uploads, extracts metadata via Apache Tika,
 * and forwards results to the Python logic engine for security analysis.
 */
@SpringBootApplication
public class FileDnaApplication {

    public static void main(String[] args) {
        SpringApplication.run(FileDnaApplication.class, args);
    }
}
