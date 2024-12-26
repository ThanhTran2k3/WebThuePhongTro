import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class RoomTypeAPI {
  final String roomTypeApi = "http://10.0.2.2:8080/api/roomType";

  Future<List<dynamic>> getRoomType() async {
    final url = Uri.parse(roomTypeApi);
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final result =  jsonDecode(utf8.decode(response.bodyBytes));
      final data = result['result'] as List;
      return List.from(data);
    }else {
      throw Exception('Không thể tải dữ liệu.');
    }
  }


}