import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const FileDnaApp());
}

class FileDnaApp extends StatelessWidget {
  const FileDnaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Universal File DNA Explorer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0A0A0A),
        primaryColor: const Color(0xFF00FF41),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00FF41),
          secondary: Color(0xFF00CC33),
          surface: Color(0xFF111111),
          error: Color(0xFFFF073A),
        ),
        fontFamily: 'RobotoMono',
        textTheme: const TextTheme(
          headlineLarge: TextStyle(
            color: Color(0xFF00FF41),
            fontWeight: FontWeight.w700,
            fontSize: 32,
            letterSpacing: 2,
          ),
          headlineMedium: TextStyle(
            color: Color(0xFF00FF41),
            fontWeight: FontWeight.w600,
            fontSize: 24,
            letterSpacing: 1.5,
          ),
          bodyLarge: TextStyle(
            color: Color(0xFFB0B0B0),
            fontSize: 16,
            letterSpacing: 0.5,
          ),
          bodyMedium: TextStyle(
            color: Color(0xFF808080),
            fontSize: 14,
            letterSpacing: 0.3,
          ),
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFF111111),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: Color(0xFF1A1A1A)),
          ),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
