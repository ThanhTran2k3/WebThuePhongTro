
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class OtpAPI {
  final String otpApi = "http://10.0.2.2:8080/api/otp";

  Future<bool> sendOTP(BuildContext context,String email) async {
    final url = Uri.parse('$otpApi/send-email');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'email': email,
      }),
    );
    print(response.statusCode);
    if (response.statusCode == 200) {
      return true;
    }
    else{
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: Text('Không tồn tại email!'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
      return false;
    }
  }


  Future<bool> verifyOTPEmail(String users,String otp) async {
    final url = Uri.parse('$otpApi/verify-otp?otp=$otp&users=$users');
    final response = await http.post(
      url,
    );
    if (response.statusCode == 200) {
      return true;
    }
    else{
      return false;
    }
  }

}