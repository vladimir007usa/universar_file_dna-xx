"""
scanner.py — Red-flag scanning engine using regex (and optional YARA rules).
Scans extracted metadata dictionaries for suspicious patterns.
"""

import re
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional

# ---------------------------------------------------------------------------
# Try to import yara; gracefully degrade if not available
# ---------------------------------------------------------------------------
try:
    import yara
    YARA_AVAILABLE = True
except ImportError:
    YARA_AVAILABLE = False


@dataclass
class RedFlag:
    """A single security finding."""
    category: str          # e.g. "Suspicious URL", "Shell Command"
    severity: str          # LOW | MEDIUM | HIGH | CRITICAL
    field: str             # metadata field where the match was found
    matched_value: str     # the substring that matched
    description: str       # human-readable explanation

    def to_dict(self) -> Dict[str, str]:
        return asdict(self)


# ═══════════════════════════════════════════════════════════════════════════
# Regex Scanner
# ═══════════════════════════════════════════════════════════════════════════

class RegexScanner:
    """Scan metadata values against a library of suspicious patterns."""

    PATTERNS: List[Dict[str, Any]] = [
        # --- URLs & Network ---
        {
            "name": "Suspicious URL",
            "pattern": r'https?://[^\s"\'<>]+\.(php|asp|aspx|jsp|cgi|sh|bat|cmd|exe|ps1)',
            "severity": "HIGH",
            "description": "URL pointing to a potentially executable server-side script.",
        },
        {
            "name": "Raw IP Address URL",
            "pattern": r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}[:/]',
            "severity": "MEDIUM",
            "description": "URL using a raw IP address instead of a domain name.",
        },
        {
            "name": "Data Exfiltration URL",
            "pattern": r'https?://[^\s]+\?(.*?)(passwd|password|token|secret|api_key|credentials)',
            "severity": "CRITICAL",
            "description": "URL that appears to transmit sensitive credentials.",
        },
        # --- Shell / Command Injection ---
        {
            "name": "Shell Command",
            "pattern": r'(?:^|[\s;|&])((?:bash|sh|cmd|powershell|curl|wget|nc|ncat|netcat)\s+[^\s]+)',
            "severity": "CRITICAL",
            "description": "Embedded shell/network command detected.",
        },
        {
            "name": "OS Command Pattern",
            "pattern": r'(?:rm\s+-rf|del\s+/[fFsS]|format\s+[a-zA-Z]:)',
            "severity": "CRITICAL",
            "description": "Destructive operating-system command detected.",
        },
        # --- Script Tags / Code Injection ---
        {
            "name": "Script Tag",
            "pattern": r'<script[\s>].*?</script>',
            "severity": "HIGH",
            "description": "Embedded HTML <script> tag — possible XSS payload.",
        },
        {
            "name": "Event Handler Injection",
            "pattern": r'\bon\w+\s*=\s*["\']',
            "severity": "MEDIUM",
            "description": "HTML event-handler attribute — possible XSS vector.",
        },
        # --- Encoded Payloads ---
        {
            "name": "Base64 Blob",
            "pattern": r'(?:[A-Za-z0-9+/]{40,}={0,2})',
            "severity": "LOW",
            "description": "Long Base64-encoded blob — may hide obfuscated content.",
        },
        # --- SQL Injection ---
        {
            "name": "SQL Injection Pattern",
            "pattern": r"(?:'\s*(?:OR|AND|UNION)\s+.*?(?:SELECT|DROP|INSERT|UPDATE|DELETE))",
            "severity": "HIGH",
            "description": "SQL injection pattern detected in metadata.",
        },
        # --- Private / Internal IPs ---
        {
            "name": "Internal IP Leaked",
            "pattern": r'(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})',
            "severity": "MEDIUM",
            "description": "Internal/private IP address found in metadata.",
        },
        # --- Email Addresses ---
        {
            "name": "Email Address",
            "pattern": r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            "severity": "LOW",
            "description": "Email address found — possible PII leakage.",
        },
        # --- File Paths ---
        {
            "name": "Absolute File Path",
            "pattern": r'(?:[A-Z]:\\(?:[^\\\s]+\\)+[^\\\s]+|/(?:etc|usr|var|tmp|home|root)/[^\s]+)',
            "severity": "MEDIUM",
            "description": "Absolute file path found — reveals internal directory structure.",
        },
    ]

    @classmethod
    def scan(cls, metadata: Dict[str, Any]) -> List[RedFlag]:
        """Scan all metadata key-value pairs for red flags."""
        flags: List[RedFlag] = []
        flat = cls._flatten(metadata)

        for key, value in flat.items():
            if not isinstance(value, str):
                value = str(value)
            for rule in cls.PATTERNS:
                matches = re.findall(rule["pattern"], value, re.IGNORECASE)
                if matches:
                    matched = matches[0] if isinstance(matches[0], str) else str(matches[0])
                    flags.append(RedFlag(
                        category=rule["name"],
                        severity=rule["severity"],
                        field=key,
                        matched_value=matched[:200],
                        description=rule["description"],
                    ))
        return flags

    @staticmethod
    def _flatten(d: Dict[str, Any], parent_key: str = "", sep: str = ".") -> Dict[str, Any]:
        """Flatten nested dicts for scanning."""
        items: List[tuple] = []
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, dict):
                items.extend(RegexScanner._flatten(v, new_key, sep).items())
            elif isinstance(v, list):
                for i, item in enumerate(v):
                    if isinstance(item, dict):
                        items.extend(RegexScanner._flatten(item, f"{new_key}[{i}]", sep).items())
                    else:
                        items.append((f"{new_key}[{i}]", item))
            else:
                items.append((new_key, v))
        return dict(items)


# ═══════════════════════════════════════════════════════════════════════════
# YARA Scanner (optional)
# ═══════════════════════════════════════════════════════════════════════════

class YaraScanner:
    """Optional YARA-based scanner for deeper analysis."""

    RULES_SOURCE = """
    rule suspicious_php {
        meta:
            description = "Detects PHP code fragments"
            severity = "HIGH"
        strings:
            $php1 = "<?php" nocase
            $php2 = "eval(" nocase
            $php3 = "base64_decode(" nocase
            $php4 = "system(" nocase
            $php5 = "exec(" nocase
            $php6 = "shell_exec(" nocase
        condition:
            any of them
    }

    rule suspicious_powershell {
        meta:
            description = "Detects PowerShell fragments"
            severity = "CRITICAL"
        strings:
            $ps1 = "Invoke-Expression" nocase
            $ps2 = "IEX(" nocase
            $ps3 = "DownloadString(" nocase
            $ps4 = "-EncodedCommand" nocase
            $ps5 = "New-Object Net.WebClient" nocase
        condition:
            any of them
    }

    rule suspicious_macro {
        meta:
            description = "Detects macro/VBA indicators"
            severity = "HIGH"
        strings:
            $m1 = "AutoOpen" nocase
            $m2 = "Auto_Open" nocase
            $m3 = "Document_Open" nocase
            $m4 = "WScript.Shell" nocase
            $m5 = "CreateObject" nocase
        condition:
            any of them
    }
    """

    _rules = None

    @classmethod
    def is_available(cls) -> bool:
        return YARA_AVAILABLE

    @classmethod
    def _compile_rules(cls):
        if cls._rules is None and YARA_AVAILABLE:
            cls._rules = yara.compile(source=cls.RULES_SOURCE)
        return cls._rules

    @classmethod
    def scan(cls, metadata: Dict[str, Any]) -> List[RedFlag]:
        if not YARA_AVAILABLE:
            return []

        rules = cls._compile_rules()
        if rules is None:
            return []

        flags: List[RedFlag] = []
        text = str(metadata)

        matches = rules.match(data=text)
        for match in matches:
            severity = "HIGH"
            if match.meta and "severity" in match.meta:
                severity = match.meta["severity"]
            description = match.meta.get("description", "YARA rule matched") if match.meta else "YARA rule matched"
            for s in match.strings:
                for instance in s.instances:
                    flags.append(RedFlag(
                        category=f"YARA: {match.rule}",
                        severity=severity,
                        field="(full metadata scan)",
                        matched_value=str(instance)[:200],
                        description=description,
                    ))
        return flags


# ═══════════════════════════════════════════════════════════════════════════
# Public API
# ═══════════════════════════════════════════════════════════════════════════

def scan_metadata(metadata: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run all scanners against the provided metadata dict.
    Returns a result dict with red_flags, risk_level, and scanner info.
    """
    all_flags: List[RedFlag] = []

    # Regex scan (always available)
    all_flags.extend(RegexScanner.scan(metadata))

    # YARA scan (optional)
    all_flags.extend(YaraScanner.scan(metadata))

    # Determine overall risk level
    risk_level = _calculate_risk(all_flags)

    return {
        "red_flags": [f.to_dict() for f in all_flags],
        "risk_level": risk_level,
        "total_flags": len(all_flags),
        "scanners_used": ["regex"] + (["yara"] if YaraScanner.is_available() else []),
    }


def _calculate_risk(flags: List[RedFlag]) -> str:
    """Calculate overall risk level from list of flags."""
    if not flags:
        return "CLEAN"

    severities = {f.severity for f in flags}
    if "CRITICAL" in severities:
        return "CRITICAL"
    elif "HIGH" in severities:
        return "HIGH"
    elif "MEDIUM" in severities:
        return "MEDIUM"
    else:
        return "LOW"
