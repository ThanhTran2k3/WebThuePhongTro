import 'dart:convert';

import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/PostAPI.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:appthuetro/screens/PostDetail.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';

class Post extends StatefulWidget {
  final Map<String, dynamic> post;

  Post({required this.post});

  @override
  _PostWidgetState createState() => _PostWidgetState();
}

class _PostWidgetState  extends State<Post> {
  late final AuthStorage _authStorage;
  List<dynamic> listPost = [];
  bool isLiked = false;
  late final FlutterSecureStorage _storage;

  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
    _loadAuthData();
    _storage = FlutterSecureStorage();
  }

  Future<void> _loadAuthData() async {
    try {

      final data = await _authStorage.getAuthData();
      listPost = data['likePost'] ?? '[]';
      setState(() {
        isLiked = listPost.any((post) => post['postId'] == widget.post['postId']);
      });
    } catch (e) {
      print('Error loading auth data: $e');
    }
  }

  String formatRentPrice(double  rentPrice) {
    return NumberFormat("#,###").format(rentPrice);
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

  @override
  Widget build(BuildContext context) {
    String imageUrl = 'http://10.0.2.2:8080${widget.post['postImages'][0]['urlImage']}';

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PostDetail(postId: widget.post['postId']),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 12.0),
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8.0),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 2,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8.0),
                image: DecorationImage(
                  image: NetworkImage(imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 14.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.post['title'],
                    style: const TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4.0),
                  Text(
                    '${widget.post['area']} m\u00B2',
                    style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 12.0,
                        fontWeight: FontWeight.bold
                    ),
                  ),
                  const SizedBox(height: 6.0),
                  Text(
                    '${formatRentPrice(widget.post['rentPrice'])} đ/tháng',
                    style: TextStyle(
                      color: Colors.red,
                      fontSize: 12.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6.0),
                  Text(
                    '${widget.post['city']}',
                    style: TextStyle(
                      color: Colors.black87,
                      fontSize: 12.0,
                    ),
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            Icon(
                              Icons.account_circle,
                              color: Colors.grey[600],
                              size: 12.0,
                            ),
                            const SizedBox(width: 4.0),
                            Text(
                              widget.post['userName'],
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 12.0,
                              ),
                            ),
                            const SizedBox(width: 2.0),
                            if (widget.post['postCategory']['postCategoryId'] == 3) ...[
                              Text(
                                '|',
                                style: TextStyle(
                                  color: Colors.black87,
                                  fontSize: 12.0,
                                ),
                              ),
                              const SizedBox(width: 2.0),
                              Icon(
                                Icons.arrow_upward,
                                color: Colors.grey[600],
                                size: 12.0,
                              ),
                              const SizedBox(width: 4.0),
                              Text(
                                'Tin ưu tiên',
                                style: TextStyle(
                                  color: Colors.black87,
                                  fontSize: 12.0,
                                ),
                              ),
                            ]
                          ],
                        ),
                      ),

                      IconButton(
                        icon: Icon(
                          isLiked ? Icons.favorite : Icons.favorite_border,
                          color: Colors.red,
                          size: 24.0,
                        ),
                        onPressed: () {
                          handleLike(context,widget.post['postId']);
                        },
                      ),
                    ],
                  )


                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

}
