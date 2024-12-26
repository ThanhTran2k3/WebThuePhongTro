import 'dart:convert';

import 'package:http/http.dart' as http;

class ServiceAPI {
  final String serviceApi = "http://10.0.2.2:8080/api/service";

  Future<List<dynamic>> getServices() async {
    try {
      final response = await http.get(Uri.parse(serviceApi));
      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'] as List<dynamic>;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  Future<Map<String, dynamic>> getServiceById(String serviceId) async {
    final String url = '$serviceApi/$serviceId';

    try {
      final response = await http.get(Uri.parse(url));

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