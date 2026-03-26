# ═══════════════════════════════════════════════════════════════
# Universal File DNA Explorer — Launch Script
# Starts all three services simultaneously.
# Usage: .\launch.ps1
# ═══════════════════════════════════════════════════════════════

$Host.UI.RawUI.WindowTitle = "Universal File DNA Explorer"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "  ║   🧬 Universal File DNA Explorer             ║" -ForegroundColor Green
Write-Host "  ║   Starting all services...                   ║" -ForegroundColor Green
Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

$ROOT = $PSScriptRoot

# ── Service 1: Python FastAPI Logic Engine (Port 5000) ──
Write-Host "[1/3] Starting Python Logic Engine on port 5000..." -ForegroundColor Cyan
$pythonJob = Start-Process -NoNewWindow -PassThru -FilePath "python" `
    -ArgumentList "main.py" `
    -WorkingDirectory "$ROOT\logic-engine"

# ── Service 2: Java Spring Boot Middleware (Port 8080) ──
Write-Host "[2/3] Starting Java Middleware on port 8080..." -ForegroundColor Cyan
$javaJob = Start-Process -NoNewWindow -PassThru -FilePath "mvn" `
    -ArgumentList "spring-boot:run" `
    -WorkingDirectory "$ROOT\middleware"

# ── Service 3: Flutter Web Frontend ──
Write-Host "[3/3] Starting Flutter Web Frontend..." -ForegroundColor Cyan
$flutterJob = Start-Process -NoNewWindow -PassThru -FilePath "flutter" `
    -ArgumentList "run -d chrome" `
    -WorkingDirectory "$ROOT\frontend"

Write-Host ""
Write-Host "  All services launching!" -ForegroundColor Green
Write-Host "  ├─ Logic Engine:  http://localhost:5000" -ForegroundColor DarkGreen
Write-Host "  ├─ Middleware:    http://localhost:8080" -ForegroundColor DarkGreen
Write-Host "  └─ Frontend:     (opens in Chrome)" -ForegroundColor DarkGreen
Write-Host ""
Write-Host "  Press Ctrl+C to stop all services." -ForegroundColor Yellow
Write-Host ""

# Wait for user interrupt
try {
    Wait-Process -Id $pythonJob.Id, $javaJob.Id, $flutterJob.Id
} catch {
    # Ctrl+C pressed
} finally {
    Write-Host ""
    Write-Host "  Shutting down services..." -ForegroundColor Red
    if (!$pythonJob.HasExited) { Stop-Process -Id $pythonJob.Id -Force -ErrorAction SilentlyContinue }
    if (!$javaJob.HasExited) { Stop-Process -Id $javaJob.Id -Force -ErrorAction SilentlyContinue }
    if (!$flutterJob.HasExited) { Stop-Process -Id $flutterJob.Id -Force -ErrorAction SilentlyContinue }
    Write-Host "  All services stopped." -ForegroundColor Red
}
