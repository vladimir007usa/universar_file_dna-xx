"""Quick test for the scanner module."""
from scanner import scan_metadata

test_metadata = {
    "Author": "John Doe",
    "URL": "http://evil.com/shell.php",
    "command": "bash -c echo hacked",
    "Description": "rm -rf /tmp/data",
    "Hidden": "192.168.1.100",
    "Email": "admin@internal.corp.com",
    "Path": "C:\\Users\\admin\\secrets\\passwords.txt",
    "Clean-Field": "Just a normal value",
}

result = scan_metadata(test_metadata)
print(f"Risk Level: {result['risk_level']}")
print(f"Total Flags: {result['total_flags']}")
print(f"Scanners Used: {result['scanners_used']}")
print()
for f in result["red_flags"]:
    print(f"  [{f['severity']:>8}] {f['category']}: {f['matched_value']}")

assert result["risk_level"] in ("HIGH", "CRITICAL"), f"Expected HIGH or CRITICAL, got {result['risk_level']}"
assert result["total_flags"] > 0, "Expected at least 1 flag"
print("\n✅ All tests passed!")
