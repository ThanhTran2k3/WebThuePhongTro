import 'dart:convert';

import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/PostAPI.dart';
import 'package:appthuetro/api/ServiceApi.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:appthuetro/screens/PaymentPage.dart';
import 'package:appthuetro/screens/UserDetail.dart';
import 'package:appthuetro/widgets/Post.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';

import '../api/UserAPI.dart';

class PostService extends StatefulWidget {
  final Map<String,dynamic> post;

  const PostService({required this.post, Key? key}) : super(key: key);

  @override
  _PostServiceState createState() => _PostServiceState();
}

class _PostServiceState extends State<PostService> {
  List<dynamic> services =[];
  late Map<String,dynamic> user;
  late final AuthStorage _authStorage;
  late final FlutterSecureStorage _storage;
  bool isLiked = false;
  List<dynamic> listPost = [];
  int selectedServiceId = 0;
  int value = 0;
  double selectedPrice =0;
  double totalAmount = 0;

  void handleChange(int serviceId, double price) {
    setState(() {
      selectedServiceId = serviceId;
      selectedPrice = price;
      totalAmount = value * price;
    });
  }

  void changeMonth(String input) {
    setState(() {
      value = int.tryParse(input) ?? 0;
      totalAmount = value * selectedPrice;
    });
  }

  void pay() {
    if (selectedServiceId != 0 && value > 0) {
      print('Thanh toán thành công với Service ID: $selectedServiceId');
    }
    if(totalAmount > user['balance']) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('Thông báo'),
            content: Text('Số dư của bạn không đủ. Bạn có muốn nạp tiền không?'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: Text('Không'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => PaymentPage(userName: user['userName']),
                    ),
                  );
                },
                child: Text('Có'),
              ),
            ],
          );
        },
      );
    }
  }

  @override
  void initState() {
    super.initState();
    _loadAuthData();
    user={};
    _authStorage = AuthStorage();
    _storage = FlutterSecureStorage();
  }

  Future<void> _loadAuthData() async {
    services = await ServiceAPI().getServices();
    try {
      final data = await _authStorage.getAuthData();
      final token = data['token'];
      print(token);
      final result = await UserAPI().getUser(token);
      user = result['result'];
      listPost = data['likePost'] ?? '[]';
      setState(() {
        isLiked = listPost.any((post) => post['postId'] == widget.post['postId']);
      });
    } catch (e) {
      print('Error loading auth data: $e');
    }
  }

  Future<void> handleLike(BuildContext context,int postId) async {
    final data = await _authStorage.getAuthData();
    if(!data['token'].toString().isEmpty){
      String token = data['token'];
      final likePost = await PostAPI().likePost(context, token, postId);
      setState(() {
        isLiked = !isLiked;
      });
      await _storage.write(key: 'likePost', value: jsonEncode(likePost));
    }else{
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => LoginPage()),
      );
    }
  }

  String formatRentPrice(double  rentPrice) {
    return NumberFormat("#,###").format(rentPrice);
  }



  @override
  Widget build(BuildContext context) {
    if (widget.post.isEmpty) {
      return Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text("Dịch vụ"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Post(post: widget.post),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(8.0,8.0,0.0,8.0),
                  child: CircleAvatar(
                    radius: 30,
                    backgroundImage: NetworkImage('http://10.0.2.2:8080${user['avatar']}'),
                    backgroundColor: Colors.transparent,
                  ),
                ),
                SizedBox(width: 12),
                if(user.isNotEmpty) ...[
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => UserDetail(userName: user['userName'])),
                          );
                        },
                        child: Text(
                          user['userName'],
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      SizedBox(height: 6),
                      Text(
                        'Số dư: ${user['balance']} đ',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.red[600],
                        ),
                      ),
                    ],
                  ),
                ]

              ],
            ),
            if (services.length==0) ...[
              Center(
              child: Text("Không có dịch vụ"),
              ),
            ],
            SizedBox(height: 14,),
            Wrap(
              spacing: 20,
              runSpacing: 10,
              children: services.map((item) {
                return GestureDetector(
                  onTap: () => handleChange(item['serviceId'],item['price']),
                  child: Container(
                    width: MediaQuery.of(context).size.width - 40,
                    padding: const EdgeInsets.all(10.0),
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: selectedServiceId == item['serviceId']
                            ? Colors.blue
                            : Colors.grey,
                      ),
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          item['serviceName'] == 'Tin ưu tiên'
                              ? Icons.arrow_upward
                              : Icons.swap_vert,
                        ),
                        const SizedBox(width: 8.0),
                        Text(item['serviceName']),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            TextField(
              onChanged: changeMonth,
              enabled: selectedServiceId != 0,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Số ngày',
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 20),

            // Tổng tiền
            TextField(
              enabled: false,
              controller: TextEditingController(
                text: totalAmount.toStringAsFixed(0),
              ),
              decoration: InputDecoration(
                labelText: 'Tổng tiền',
                suffixText: 'đ',
                border: const OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 20),

            Center(
              child: ElevatedButton(
                onPressed: pay,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                ),
                child: Text(
                  "Thanh toán",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            )

          ],
        ),
      ),
    );




  }
}
