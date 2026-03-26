# 🧬 Universal File DNA Explorer

A stateless multi-service web application that extracts deep metadata and identifies security red flags from uploaded files — without storing any data.

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Flutter Web     │ ───> │  Spring Boot     │ ───> │  Python FastAPI  │
│  Frontend        │      │  Middleware       │      │  Logic Engine    │
│  (Browser)       │      │  :8080           │      │  :5000           │
│                  │ <─── │  Apache Tika      │ <─── │  Regex + YARA    │
└──────────────────┘      └──────────────────┘      └──────────────────┘
     Drag & Drop            Metadata Extraction       Threat Scanning
```

## Features

- **🔬 Deep Metadata Extraction** — EXIF, headers, embedded text, content-type detection via Apache Tika
- **🛡️ Security Red-Flag Scanning** — Regex + optional YARA rules detect suspicious URLs, shell commands, encoded payloads, SQL injection patterns, PII leaks
- **🖥️ Cyber-Industrial UI** — Dark theme with neon green accents, pulsing animations, color-coded risk levels
- **📦 Fully Stateless** — No database, no authentication, no data stored

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Python** | 3.10+ | Logic Engine (FastAPI) |
| **JDK** | 17+ | Middleware (Spring Boot) |
| **Maven** | 3.8+ | Build Java project |
| **Flutter SDK** | 3.0+ | Frontend (Web) |

### Installing Missing Tools

<details>
<summary><b>Install JDK 17 (Windows)</b></summary>

1. Download from [Adoptium](https://adoptium.net/temurin/releases/?version=17)
2. Run installer, check "Add to PATH"
3. Verify: `java -version`
</details>

<details>
<summary><b>Install Maven (Windows)</b></summary>

1. Download from [maven.apache.org](https://maven.apache.org/download.cgi)
2. Extract to `C:\Program Files\Maven`
3. Add `C:\Program Files\Maven\bin` to system PATH
4. Verify: `mvn --version`
</details>

<details>
<summary><b>Install Flutter SDK (Windows)</b></summary>

1. Download from [flutter.dev](https://docs.flutter.dev/get-started/install/windows)
2. Extract to `C:\flutter`
3. Add `C:\flutter\bin` to system PATH
4. Run: `flutter doctor`
5. Enable web: `flutter config --enable-web`
</details>

---

## Project Structure

```
Universal_File_DNA/
├── README.md
├── launch.ps1                    # PowerShell script to launch all services
│
├── logic-engine/                 # Python FastAPI (Port 5000)
│   ├── requirements.txt
│   ├── main.py                   # FastAPI app + /api/analyze endpoint
│   └── scanner.py                # Regex & YARA scanning engine
│
├── middleware/                    # Java Spring Boot (Port 8080)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/filedna/
│       │   ├── FileDnaApplication.java
│       │   ├── config/WebConfig.java
│       │   ├── controller/FileAnalysisController.java
│       │   └── service/MetadataExtractor.java
│       └── resources/application.properties
│
└── frontend/                     # Flutter Web (Browser)
    ├── pubspec.yaml
    ├── web/index.html
    └── lib/
        ├── main.dart
        ├── screens/home_screen.dart
        ├── services/api_service.dart
        └── widgets/
            ├── drop_zone.dart
            ├── scan_animation.dart
            └── result_tree.dart
```

---

## Quick Start — Launch All Services

### Option 1: PowerShell Script (Recommended)

```powershell
.\launch.ps1
```

This starts all three services in parallel. Press `Ctrl+C` to terminate all.

### Option 2: Manual Launch (3 Terminals)

**Terminal 1 — Python Logic Engine (Port 5000):**
```bash
cd logic-engine
pip install -r requirements.txt
python main.py
```

**Terminal 2 — Java Middleware (Port 8080):**
```bash
cd middleware
mvn spring-boot:run
```

**Terminal 3 — Flutter Frontend:**
```bash
cd frontend
flutter pub get
flutter run -d chrome
```

---

## API Endpoints

### Java Middleware (`:8080`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/upload` | Upload file (multipart/form-data) |

### Python Logic Engine (`:5000`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check |
| `POST` | `/api/analyze` | Analyze metadata JSON for red flags |

---

## Communication Flow

```
1. User drags & drops a file in the Flutter Web UI
2. Flutter sends multipart POST to Java middleware (:8080/api/upload)
3. Java extracts all metadata using Apache Tika
4. Java forwards metadata JSON to Python engine (:5000/api/analyze)
5. Python scans for red flags using Regex + YARA rules
6. Response flows back: Python → Java → Flutter
7. Flutter displays results in a JSON tree with risk-level badges
```

## Risk Levels

| Level | Color | Description |
|-------|-------|-------------|
| **CLEAN** | 🟢 Green | No threats detected |
| **LOW** | 🔵 Blue | Minor informational findings |
| **MEDIUM** | 🟡 Yellow | Moderate concerns (PII, internal IPs) |
| **HIGH** | 🟠 Orange | Significant threats (suspicious URLs, injections) |
| **CRITICAL** | 🔴 Red | Severe threats (shell commands, exploits) |

---

## License

MIT — Built for educational and security research purposes.
