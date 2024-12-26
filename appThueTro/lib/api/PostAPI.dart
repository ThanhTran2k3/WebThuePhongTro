import 'dart:convert';
import 'dart:io';
import 'package:appthuetro/main.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

class PostAPI {
  final String postApi = "http://10.0.2.2:8080/api/post";

  Future<Map<String, dynamic>> getPosts({
    required int page,
    String? city,
    String? district,
    String? ward,
    String? roomType,
  }) async {

    try {

      final Uri url = Uri.parse(postApi).replace(queryParameters: {
        'page': page.toString(),
        if (city != null) 'city': city,
        if (district != null) 'district': district,
        if (ward != null) 'ward': ward,
        if (roomType != null) 'roomType': roomType,
      });

      final response = await http.get(url);

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'];
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  }

  Future<List<dynamic>> getNewPost() async {
    final response = await http.get(Uri.parse('$postApi/new'));
    if (response.statusCode == 200) {
      Map<String, dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return List.from(data['result']);
    } else {
      throw Exception('Không thể tải dữ liệu bài viết.');
    }
  }

  Future<List<dynamic>> getPostLocation(String city) async {
    try {
      final response = await http.get(
        Uri.parse('$postApi/location?city=$city'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'] ?? [];
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  Future<Map<String, dynamic>> getPostDetail(int postId) async {
    final response = await http.get(Uri.parse('${postApi}/detail/${postId}'));
    if (response.statusCode == 200) {
      Map<String, dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data['result'];
    } else {
      throw Exception('Không thể tải dữ liệu bài viết.');
    }
  }

  Future<void>  addPost(BuildContext context,Map<String, dynamic> formData,String token) async {
    final url = Uri.parse('$postApi/add');
    var request = http.MultipartRequest('POST', url);
    request.headers.addAll({
      'Authorization': 'Bearer $token',
      'Content-Type': 'multipart/form-data',
    });
    formData.forEach((key, value) {
      if (value is List<File>) {
        for (var file in value) {
          if (file.existsSync()) {
            request.files.add(
              http.MultipartFile(
                key,
                file.readAsBytes().asStream(),
                file.lengthSync(),
                filename: file.uri.pathSegments.last,
                contentType: MediaType('image', 'jpeg'),
              ),
            );
          }
        }
      } else {
        request.fields[key] = value.toString();
      }
    });
    try {
      var response = await request.send();

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Đăng bài thành công!')),
        );
        Navigator.pop(context);
      } else {
        throw Exception('Đã xảy ra lỗi: ${response.statusCode}');
      }
    } catch (e) {
      print('Error occurred: $e');
    }
  }

  Future<void>  editPost(BuildContext context,int postId,Map<String, dynamic> formData,String token) async {
    final url = Uri.parse('$postApi/edit/$postId');
    var request = http.MultipartRequest('PUT', url);
    request.headers.addAll({
      'Authorization': 'Bearer $token',
      'Content-Type': 'multipart/form-data',
    });
    formData.forEach((key, value) {
      if (value is List<File>) {
        for (var file in value) {
          if (file.existsSync()) {
            request.files.add(
              http.MultipartFile(
                key,
                file.readAsBytes().asStream(),
                file.lengthSync(),
                filename: file.uri.pathSegments.last,
                contentType: MediaType('image', 'jpeg'),
              ),
            );
          }
        }
      } else {
        request.fields[key] = value.toString();
      }
    });
    try {
      var response = await request.send();

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Chỉnh sửa thành công!')),
        );
        Navigator.pop(context);
      } else {
        throw Exception('Đã xảy ra lỗi: ${response.statusCode}');
      }
    } catch (e) {
      print('Error occurred: $e');
    }
  }

  Future<dynamic> likePost(BuildContext context,String token, int postId) async {
    final url = Uri.parse('$postApi/like/$postId');
    try {
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'];
      } else {
        final errorData = jsonDecode(utf8.decode(response.bodyBytes));
        throw Exception(errorData['error']);
      }
    } catch (error) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: Text(error.toString()),
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

  Future<dynamic> showPost(BuildContext context,String token, int postId) async {
    final url = Uri.parse('$postApi/show/$postId');
    try {
      final response = await http.put(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'];
      }
    } catch (error) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: Text(error.toString()),
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

  Future<Map<String, dynamic>> getPostById(BuildContext context,String token, int postId) async {
    final url = Uri.parse('$postApi/$postId');
    try {
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'];
      }
      else{
        throw Exception('Không thể tải dữ liệu bài viết.');
      }
    } catch (error) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: Text(error.toString()),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
      throw Exception('Không thể tải dữ liệu bài viết.');
    }
  }

  Future<List<dynamic>> postSuggestions(String query) async {
    try {
      final response = await http.get(
        Uri.parse('$postApi/search/suggestions').replace(queryParameters: {
          'query': query,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'] ?? [];
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }


  Future<Map<String, dynamic>> postSearch({required String query,
    required int page,
    String? city,
    String? district,
    String? ward,
    String? roomType,
  }) async {
    try {
      final uri = Uri.parse('$postApi/search/result').replace(queryParameters: {
        'query': query,
        'page': page.toString(),
        if (city != null) 'city': city,
        if (district != null) 'district': district,
        if (ward != null) 'ward': ward,
        if (roomType != null) 'roomType': roomType,
      });

      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'];
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  }


}
