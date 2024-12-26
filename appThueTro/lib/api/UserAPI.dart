import 'dart:convert';
import 'dart:io';
import 'package:appthuetro/main.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

class UserAPI {
  final String userApi = "http://10.0.2.2:8080/api/user";

  Future<Map<String, dynamic>> getInfoUser(String userName) async {
    final response = await http.get(Uri.parse('${userApi}/${userName}'));
    if (response.statusCode == 200) {
      Map<String, dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data['result'];
    } else {
      throw Exception('Không thể tải dữ liệu bài viết.');
    }
  }

  Future<Map<String, dynamic>> getPostUser(String userName, String postType, int page) async {
    final Uri url = Uri.parse('$userApi/post/$userName').replace(
      queryParameters: {
        'postType': postType,
        'page': page.toString(),
      },
    );
    final response = await http.get(url);
    if (response.statusCode == 200) {
      Map<String, dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data['result'];
    } else {
      throw Exception('Không thể tải dữ liệu bài viết.');
    }
  }

  Future<Map<String, dynamic>> getUser(String token) async {
    final url = Uri.parse('$userApi/detail');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
    final Map<String, dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
    return data;
  }


  Future<void> editUser(BuildContext context,Map<String, dynamic> formData,String token) async {
    final url = Uri.parse('$userApi/edit/profile');
    var request = http.MultipartRequest('PUT', url);
    request.headers.addAll({
      'Authorization': 'Bearer $token',
      'Content-Type': 'multipart/form-data',
    });

    formData.forEach((key, value) {
      if (value is File) {
          final file = http.MultipartFile(
            key,
            value.readAsBytes().asStream(),
            value.lengthSync(),
            filename: value.uri.pathSegments.last,
            contentType: MediaType('image', 'jpeg'),
          );
          request.files.add(file);
      } else {
        request.fields[key] = value.toString();
      }
    });
    try {
      var response = await request.send();

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lưu thành công!')),
        );
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => MyApp()),
        );
      } else {
        final errorData = jsonDecode(utf8.decode(await response.stream.toBytes()));
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
    } catch (e) {
      print('Error occurred: $e');
    }
  }


}
