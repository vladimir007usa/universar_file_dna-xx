import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import '../services/api_service.dart';
import '../widgets/drop_zone.dart';
import '../widgets/scan_animation.dart';
import '../widgets/result_tree.dart';

/// Main screen — file upload, scanning animation, and result display.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // States: idle, scanning, results, error
  String _state = 'idle';
  String _fileName = '';
  int _fileSize = 0;
  Map<String, dynamic>? _result;
  String _errorMessage = '';

  Future<void> _handleFilePicked(String name, Uint8List bytes) async {
    setState(() {
      _state = 'scanning';
      _fileName = name;
      _fileSize = bytes.length;
      _result = null;
      _errorMessage = '';
    });

    try {
      final result = await ApiService.uploadFile(
        fileName: name,
        fileBytes: bytes,
      );
      setState(() {
        _state = 'results';
        _result = result;
      });
    } catch (e) {
      setState(() {
        _state = 'error';
        _errorMessage = e.toString();
      });
    }
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      withData: true,
      type: FileType.any,
    );
    if (result != null && result.files.single.bytes != null) {
      _handleFilePicked(
        result.files.single.name,
        result.files.single.bytes!,
      );
    }
  }

  void _reset() {
    setState(() {
      _state = 'idle';
      _fileName = '';
      _fileSize = 0;
      _result = null;
      _errorMessage = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF0A0A0A),
              Color(0xFF0D1117),
              Color(0xFF0A0A0A),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              _buildHeader(),
              Expanded(child: _buildBody()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Color(0xFF1A1A1A), width: 1),
        ),
      ),
      child: Row(
        children: [
          // DNA Icon
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF00FF41), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF00FF41).withOpacity(0.2),
                  blurRadius: 12,
                ),
              ],
            ),
            child: const Center(
              child: Text(
                '⟁',
                style: TextStyle(
                  color: Color(0xFF00FF41),
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'UNIVERSAL FILE DNA',
                style: TextStyle(
                  color: Color(0xFF00FF41),
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 3,
                ),
              ),
              Text(
                'DEEP METADATA EXPLORER & THREAT SCANNER',
                style: TextStyle(
                  color: Color(0xFF555555),
                  fontSize: 10,
                  letterSpacing: 2,
                ),
              ),
            ],
          ),
          const Spacer(),
          if (_state != 'idle')
            TextButton.icon(
              onPressed: _reset,
              icon: const Icon(Icons.refresh, color: Color(0xFF555555), size: 16),
              label: const Text(
                'NEW SCAN',
                style: TextStyle(
                  color: Color(0xFF555555),
                  fontSize: 11,
                  letterSpacing: 1.5,
                ),
              ),
              style: TextButton.styleFrom(
                side: const BorderSide(color: Color(0xFF333333)),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(6),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    switch (_state) {
      case 'scanning':
        return ScanAnimation(fileName: _fileName, fileSize: _fileSize);
      case 'results':
        return ResultTree(data: _result!, fileName: _fileName);
      case 'error':
        return _buildError();
      default:
        return DropZone(
          onFilePicked: _handleFilePicked,
          onBrowse: _pickFile,
        );
    }
  }

  Widget _buildError() {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(32),
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: const Color(0xFF111111),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFFF073A).withOpacity(0.3)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, color: Color(0xFFFF073A), size: 48),
            const SizedBox(height: 16),
            const Text(
              'ANALYSIS FAILED',
              style: TextStyle(
                color: Color(0xFFFF073A),
                fontSize: 18,
                fontWeight: FontWeight.w700,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _errorMessage,
              style: const TextStyle(color: Color(0xFF808080), fontSize: 13),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _reset,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1A1A1A),
                foregroundColor: const Color(0xFF00FF41),
                side: const BorderSide(color: Color(0xFF00FF41)),
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
              ),
              child: const Text('TRY AGAIN', style: TextStyle(letterSpacing: 1.5)),
            ),
          ],
        ),
      ),
    );
  }
}
