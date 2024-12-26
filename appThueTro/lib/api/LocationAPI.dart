import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LocationAPI {
  final String locationApi = "https://esgoo.net/api-tinhthanh";

  Future<List<dynamic>> getCity() async {
    final url = Uri.parse('$locationApi/1/0.htm');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final result =  jsonDecode(utf8.decode(response.bodyBytes));
      final data = result['data'] as List;
      return List.from(data);
    }else {
      throw Exception('Không thể tải dữ liệu.');
    }
  }

  Future<List<dynamic>> getDistricts(cityId) async {
    final url = Uri.parse('$locationApi/2/$cityId.htm');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final result =  jsonDecode(utf8.decode(response.bodyBytes));
      final data = result['data'] as List;
      return List.from(data);
    }else {
      throw Exception('Không thể tải dữ liệu.');
    }
  }

  Future<List<dynamic>> getWard(districtId) async {
    final url = Uri.parse('$locationApi/3/$districtId.htm');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final result =  jsonDecode(utf8.decode(response.bodyBytes));
      final data = result['data'] as List;
      return List.from(data);
    }else {
      throw Exception('Không thể tải dữ liệu.');
    }
  }
}