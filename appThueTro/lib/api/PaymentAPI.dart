
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:url_launcher/url_launcher.dart';


class PaymentAPI{
  final String paymentApi = "http://10.0.2.2:8080/api/payment";

  Future<void> payment(BuildContext context,String token, String amount) async {
    final Uri url = Uri.parse('${paymentApi}/momo?amount=${amount}');
    final response = await http.post(url,
      headers: {
        'Authorization': 'Bearer $token'
      },
    );
    print(response.statusCode);
    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      final payUrl = responseData['payUrl'];
      if (payUrl != null) {
        if (!await launchUrl(Uri.parse(payUrl))) {
          throw Exception("Lỗi");
        }
      } else {
        throw Exception('Không lấy được URL thanh toán.');
      }
    }

  }
}