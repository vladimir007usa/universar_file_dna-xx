import 'dart:math';
import 'package:flutter/material.dart';

/// Cyber-industrial scanning animation shown during file analysis.
class ScanAnimation extends StatefulWidget {
  final String fileName;
  final int fileSize;

  const ScanAnimation({
    super.key,
    required this.fileName,
    required this.fileSize,
  });

  @override
  State<ScanAnimation> createState() => _ScanAnimationState();
}

class _ScanAnimationState extends State<ScanAnimation>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _scanLineController;
  late AnimationController _progressController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _scanLineAnimation;

  final List<String> _scanStages = [
    'Initializing Tika parser...',
    'Extracting file headers...',
    'Reading EXIF metadata...',
    'Parsing embedded content...',
    'Extracting hidden strings...',
    'Forwarding to logic engine...',
    'Running regex pattern scan...',
    'Checking YARA rules...',
    'Analyzing threat indicators...',
    'Compiling security report...',
  ];

  int _currentStage = 0;

  @override
  void initState() {
    super.initState();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _scanLineController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat();
    _scanLineAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _scanLineController, curve: Curves.linear),
    );

    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..forward();

    // Cycle through stages
    _advanceStages();
  }

  void _advanceStages() async {
    for (int i = 0; i < _scanStages.length; i++) {
      await Future.delayed(Duration(milliseconds: 600 + Random().nextInt(400)));
      if (mounted) {
        setState(() => _currentStage = i);
      }
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _scanLineController.dispose();
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(48),
        constraints: const BoxConstraints(maxWidth: 600),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Pulsing DNA icon
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0xFF00FF41)
                          .withOpacity(_pulseAnimation.value),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF00FF41)
                            .withOpacity(_pulseAnimation.value * 0.4),
                        blurRadius: 30,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      '⟁',
                      style: TextStyle(
                        color: const Color(0xFF00FF41)
                            .withOpacity(_pulseAnimation.value),
                        fontSize: 40,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 32),
            // SCANNING label
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Text(
                  'S C A N N I N G',
                  style: TextStyle(
                    color: const Color(0xFF00FF41)
                        .withOpacity(0.5 + _pulseAnimation.value * 0.5),
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 8,
                  ),
                );
              },
            ),
            const SizedBox(height: 8),
            Text(
              widget.fileName,
              style: const TextStyle(
                color: Color(0xFF555555),
                fontSize: 12,
                letterSpacing: 1,
              ),
            ),
            Text(
              '${(widget.fileSize / 1024).toStringAsFixed(1)} KB',
              style: const TextStyle(
                color: Color(0xFF333333),
                fontSize: 11,
              ),
            ),
            const SizedBox(height: 32),
            // Scan line animation bar
            AnimatedBuilder(
              animation: _scanLineAnimation,
              builder: (context, child) {
                return Container(
                  height: 2,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(1),
                    color: const Color(0xFF1A1A1A),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        left: _scanLineAnimation.value *
                            (MediaQuery.of(context).size.width - 96 - 60),
                        child: Container(
                          width: 60,
                          height: 2,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(1),
                            gradient: const LinearGradient(
                              colors: [
                                Colors.transparent,
                                Color(0xFF00FF41),
                                Colors.transparent,
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            // Current stage text
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: Row(
                key: ValueKey(_currentStage),
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.terminal, color: Color(0xFF00FF41), size: 14),
                  const SizedBox(width: 8),
                  Text(
                    _scanStages[_currentStage],
                    style: const TextStyle(
                      color: Color(0xFF00CC33),
                      fontSize: 13,
                      fontFamily: 'RobotoMono',
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            // Progress dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_scanStages.length, (i) {
                return Container(
                  width: 6,
                  height: 6,
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: i <= _currentStage
                        ? const Color(0xFF00FF41)
                        : const Color(0xFF1A1A1A),
                    boxShadow: i <= _currentStage
                        ? [
                            BoxShadow(
                              color: const Color(0xFF00FF41).withOpacity(0.5),
                              blurRadius: 6,
                            ),
                          ]
                        : null,
                  ),
                );
              }),
            ),
          ],
        ),
      ),
    );
  }
}
