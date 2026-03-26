import 'package:flutter/material.dart';

/// Displays the analysis results in a JSON-like expandable tree view
/// with security-aware color coding.
class ResultTree extends StatelessWidget {
  final Map<String, dynamic> data;
  final String fileName;

  const ResultTree({
    super.key,
    required this.data,
    required this.fileName,
  });

  @override
  Widget build(BuildContext context) {
    // Extract top-level sections
    final metadata = data['metadata'] as Map<String, dynamic>? ?? {};
    final securityAnalysis =
        data['securityAnalysis'] as Map<String, dynamic>? ?? {};
    final riskLevel = securityAnalysis['risk_level']?.toString() ?? 'UNKNOWN';
    final redFlags = securityAnalysis['red_flags'] as List<dynamic>? ?? [];
    final detectedType = data['detectedType']?.toString() ?? 'unknown';
    final fileSize = data['fileSize'] ?? 0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Summary Banner ──
          _buildSummaryBanner(riskLevel, detectedType, fileSize, redFlags.length),
          const SizedBox(height: 24),

          // ── Red Flags Section ──
          if (redFlags.isNotEmpty) ...[
            _buildSectionHeader(
              'SECURITY RED FLAGS',
              Icons.warning_amber_rounded,
              _riskColor(riskLevel),
            ),
            const SizedBox(height: 12),
            ...redFlags.map((flag) => _buildRedFlagCard(flag as Map<String, dynamic>)),
            const SizedBox(height: 24),
          ],

          // ── Metadata Tree ──
          _buildSectionHeader(
            'EXTRACTED METADATA',
            Icons.account_tree_outlined,
            const Color(0xFF00FF41),
          ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0D0D0D),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF1A1A1A)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: metadata.entries.map((entry) {
                return _buildMetadataRow(entry.key, entry.value.toString());
              }).toList(),
            ),
          ),
          const SizedBox(height: 24),

          // ── Extracted Text ──
          if (data['extractedText'] != null &&
              data['extractedText'].toString().trim().isNotEmpty) ...[
            _buildSectionHeader(
              'EXTRACTED TEXT CONTENT',
              Icons.text_snippet_outlined,
              const Color(0xFF00BFFF),
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              constraints: const BoxConstraints(maxHeight: 300),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF0D0D0D),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF1A1A1A)),
              ),
              child: SingleChildScrollView(
                child: SelectableText(
                  data['extractedText'].toString(),
                  style: const TextStyle(
                    color: Color(0xFF808080),
                    fontSize: 12,
                    fontFamily: 'RobotoMono',
                    height: 1.6,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],

          // ── Scanner Info ──
          _buildSectionHeader(
            'SCAN ENGINE INFO',
            Icons.build_circle_outlined,
            const Color(0xFF555555),
          ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0D0D0D),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF1A1A1A)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildMetadataRow('Scanners Used',
                    (securityAnalysis['scanners_used'] ?? []).join(', ')),
                _buildMetadataRow('Total Flags',
                    securityAnalysis['total_flags']?.toString() ?? '0'),
                _buildMetadataRow(
                    'Scan Duration',
                    '${securityAnalysis['scan_duration_ms']?.toString() ?? '?'} ms'),
              ],
            ),
          ),
          const SizedBox(height: 48),
        ],
      ),
    );
  }

  Widget _buildSummaryBanner(
      String riskLevel, String detectedType, dynamic fileSize, int flagCount) {
    final color = _riskColor(riskLevel);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color.withOpacity(0.04),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          // Risk badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: color.withOpacity(0.5)),
            ),
            child: Column(
              children: [
                Text(
                  riskLevel,
                  style: TextStyle(
                    color: color,
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'RISK LEVEL',
                  style: TextStyle(
                    color: color.withOpacity(0.6),
                    fontSize: 9,
                    letterSpacing: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 24),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fileName,
                  style: const TextStyle(
                    color: Color(0xFFDDDDDD),
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    _buildInfoChip(Icons.description_outlined, detectedType),
                    const SizedBox(width: 12),
                    _buildInfoChip(
                        Icons.data_usage, _formatFileSize(fileSize)),
                    const SizedBox(width: 12),
                    _buildInfoChip(Icons.flag_outlined, '$flagCount flags'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: const Color(0xFF555555), size: 14),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFF555555),
            fontSize: 11,
            letterSpacing: 0.3,
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, Color color) {
    return Row(
      children: [
        Icon(icon, color: color, size: 18),
        const SizedBox(width: 8),
        Text(
          title,
          style: TextStyle(
            color: color,
            fontSize: 13,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
      ],
    );
  }

  Widget _buildRedFlagCard(Map<String, dynamic> flag) {
    final severity = flag['severity']?.toString() ?? 'UNKNOWN';
    final color = _severityColor(severity);

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.03),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Severity badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              severity,
              style: TextStyle(
                color: color,
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 1,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  flag['category']?.toString() ?? '',
                  style: TextStyle(
                    color: color,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  flag['description']?.toString() ?? '',
                  style: const TextStyle(
                    color: Color(0xFF808080),
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Text(
                      'Field: ',
                      style: TextStyle(color: Color(0xFF555555), fontSize: 11),
                    ),
                    Text(
                      flag['field']?.toString() ?? '',
                      style: const TextStyle(
                        color: Color(0xFF00BFFF),
                        fontSize: 11,
                        fontFamily: 'RobotoMono',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    const Text(
                      'Match: ',
                      style: TextStyle(color: Color(0xFF555555), fontSize: 11),
                    ),
                    Flexible(
                      child: Text(
                        flag['matched_value']?.toString() ?? '',
                        style: TextStyle(
                          color: color.withOpacity(0.8),
                          fontSize: 11,
                          fontFamily: 'RobotoMono',
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetadataRow(String key, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 220,
            child: Text(
              key,
              style: const TextStyle(
                color: Color(0xFF00CC33),
                fontSize: 12,
                fontFamily: 'RobotoMono',
              ),
            ),
          ),
          const Text(
            ' : ',
            style: TextStyle(
              color: Color(0xFF333333),
              fontSize: 12,
              fontFamily: 'RobotoMono',
            ),
          ),
          Expanded(
            child: SelectableText(
              value,
              style: const TextStyle(
                color: Color(0xFFAAAAAA),
                fontSize: 12,
                fontFamily: 'RobotoMono',
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatFileSize(dynamic bytes) {
    if (bytes == null) return 'unknown';
    final b = bytes is int ? bytes : int.tryParse(bytes.toString()) ?? 0;
    if (b < 1024) return '$b B';
    if (b < 1024 * 1024) return '${(b / 1024).toStringAsFixed(1)} KB';
    return '${(b / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  Color _riskColor(String level) {
    switch (level.toUpperCase()) {
      case 'CRITICAL':
        return const Color(0xFFFF073A);
      case 'HIGH':
        return const Color(0xFFFF6B35);
      case 'MEDIUM':
        return const Color(0xFFFFD700);
      case 'LOW':
        return const Color(0xFF00BFFF);
      case 'CLEAN':
        return const Color(0xFF00FF41);
      default:
        return const Color(0xFF555555);
    }
  }

  Color _severityColor(String severity) {
    return _riskColor(severity);
  }
}
