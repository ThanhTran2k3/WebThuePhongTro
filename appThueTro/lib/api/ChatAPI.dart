import 'dart:convert';
import 'package:http/http.dart' as http;

class ChatAPI {
  final String chatApi = "http://10.0.2.2:8080/api/messages";

  Future<List<dynamic>> getListUserChat(String token) async {
    try {
      final response = await http.get(
        Uri.parse(chatApi),
        headers: {
          'Authorization': 'Bearer ${token}',
        },
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
  Future<List<dynamic>> getDetailChat(String token, String userChat) async {
    try {
      final response = await http.get(
        Uri.parse("${chatApi}/detail").replace(
          queryParameters: {
          'userChat': userChat,
          },),
        headers: {
          'Authorization': 'Bearer ${token}',
        },

      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        return data['result'] ?? {};
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

}