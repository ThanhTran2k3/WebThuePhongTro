import 'dart:convert';
import 'package:appthuetro/main.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AuthAPI {
  final String authApi = "http://10.0.2.2:8080/api/auth";

  Future<Map<String, dynamic>> login(String username, String password) async {
    final url = Uri.parse('$authApi/log-in');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'userName': username,
          'password': password,
        }),
      );
      final Map<String, dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data;
  }

  Future<void> register(BuildContext context,String username,String email, String phoneNumber, String password) async {
    final url = Uri.parse('$authApi/register');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'userName': username,
        'email': email,
        'phoneNumber': phoneNumber,
        'password': password,
      }),
    );
    if(response.statusCode ==200){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Đăng ký thành công!')),
      );
      Navigator.pop(context);
    }
    else{
      final errorData = jsonDecode(utf8.decode(response.bodyBytes));
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: (errorData['error'] as List)
                  .map<Widget>((err) {
                var errorDetail = err.split(':')[1].trim();
                return Text(errorDetail);
              }).toList(),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
    }
  }

  Future<void> changePass(BuildContext context,String token, String oldPassword,String newPassword) async {
    final url = Uri.parse('$authApi/changePass');
    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'oldPassword': oldPassword,
        'newPassword': newPassword,
      }),
    );
    if(response.statusCode==200){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Đổi mật khẩu thành công!')),
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => MyApp()),
      );
    }
    else{
      final errorData = jsonDecode(utf8.decode(response.bodyBytes));
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: (errorData['error'] is List)
                  ? (errorData['error'] as List)
                  .map<Widget>((err) {
                var errorDetail = err.split(':')[1].trim();
                return Text(errorDetail);
              }).toList()
                  : [Text(errorData['error'].toString())],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
    }
  }

  Future<void> changePassOTP(BuildContext context,String email,String newPassword) async {
    final url = Uri.parse('$authApi/changePassOTP');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'newPassword': newPassword,
        'email': email,
      }),
    );
    if(response.statusCode==200){
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Đổi mật khẩu thành công!')),
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => MyApp()),
      );
    }
    else{
      final errorData = jsonDecode(utf8.decode(response.bodyBytes));
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: (errorData['error'] is List)
                  ? (errorData['error'] as List)
                  .map<Widget>((err) {
                var errorDetail = err.split(':')[1].trim();
                return Text(errorDetail);
              }).toList()
                  : [Text(errorData['error'].toString())],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
    }
  }
}