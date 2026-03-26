import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

/// File upload zone with glowing border animation.
/// Simplified version using FilePicker for stability across Flutter versions.
class DropZone extends StatefulWidget {
  final Function(String name, Uint8List bytes) onFilePicked;
  final VoidCallback onBrowse;

  const DropZone({
    super.key,
    required this.onFilePicked,
    required this.onBrowse,
  });

  @override
  State<DropZone> createState() => _DropZoneState();
}

class _DropZoneState extends State<DropZone> with SingleTickerProviderStateMixin {
  late AnimationController _glowController;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _glowAnimation = Tween<double>(begin: 0.1, end: 0.4).animate(
      CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _glowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _glowAnimation,
        builder: (context, child) {
          return Container(
            margin: const EdgeInsets.all(48),
            constraints: const BoxConstraints(maxWidth: 700, maxHeight: 450),
            child: InkWell(
              onTap: widget.onBrowse,
              borderRadius: BorderRadius.circular(16),
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF0D0D0D),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFF00FF41).withOpacity(_glowAnimation.value),
                    width: 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF00FF41)
                          .withOpacity(_glowAnimation.value * 0.3),
                      blurRadius: 20,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Upload icon with glow
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: const Color(0xFF00FF41).withOpacity(0.3),
                          width: 1.5,
                        ),
                      ),
                      child: const Icon(
                        Icons.cloud_upload_outlined,
                        color: Color(0xFF00FF41),
                        size: 36,
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'DNA SEQUENCE UPLOAD',
                      style: TextStyle(
                        color: Color(0xFF00FF41),
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 4,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'click here to browse system files',
                      style: TextStyle(
                        color: Color(0xFF555555),
                        fontSize: 13,
                        letterSpacing: 1,
                      ),
                    ),
                    const SizedBox(height: 32),
                    // Supported formats
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFF1A1A1A)),
                      ),
                      child: const Text(
                        'PDF • DOCX • XLSX • JPEG • PNG • EXE • ZIP • ANY FILE',
                        style: TextStyle(
                          color: Color(0xFF444444),
                          fontSize: 10,
                          letterSpacing: 1.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Max size
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.lock_outline, color: Color(0xFF333333), size: 14),
                        SizedBox(width: 8),
                        Text(
                          'ENCRYPTED CHANNEL • STATELESS ANALYSIS • 50 MB LIMIT',
                          style: TextStyle(
                            color: Color(0xFF333333),
                            fontSize: 9,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
