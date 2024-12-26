import 'dart:convert';
import 'package:http/http.dart' as http;

class InvoiceAPI {
  final String invoiceApi = "http://10.0.2.2:8080/api/invoice";

  Future<Map<String, dynamic>> getInvoice(String token, int page, String? service) async {
    final Uri url = Uri.parse('${invoiceApi}/history').replace(
      queryParameters: {
        if(service?.length!=0)'service': service,
        'page': page.toString(),
      },
    );

    final response = await http.get(url, headers: {
      'Authorization': 'Bearer $token',
    });

    if (response.statusCode == 200) {
      Map<String, dynamic> data = jsonDecode(utf8.decode(response.bodyBytes));
      return data['result'];
    } else {
      throw Exception('Lỗi: ${response.statusCode}');
    }
  }
}
