import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;

/// Service to communicate with the Java Spring Boot middleware.
class ApiService {
  static const String _baseUrl = 'http://localhost:8080';

  /// Upload a file to the middleware for analysis.
  /// Returns the full JSON response as a Map.
  static Future<Map<String, dynamic>> uploadFile({
    required String fileName,
    required Uint8List fileBytes,
  }) async {
    final uri = Uri.parse('$_baseUrl/api/upload');

    final request = http.MultipartRequest('POST', uri)
      ..files.add(http.MultipartFile.fromBytes(
        'file',
        fileBytes,
        filename: fileName,
      ));

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception(
        'Upload failed (${response.statusCode}): ${response.body}',
      );
    }
  }

  /// Check if the middleware service is healthy.
  static Future<bool> checkHealth() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/health'),
      ).timeout(const Duration(seconds: 3));
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
