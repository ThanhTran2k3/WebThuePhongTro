
import 'package:appthuetro/widgets/Post.dart';
import 'package:flutter/material.dart';

class ListPost extends StatelessWidget  {
  final List<dynamic> posts;

  const ListPost({required this.posts, Key? key}) : super(key: key);


  @override
  Widget build(BuildContext context) {
    return posts.isEmpty
        ? Center(
      child: Text(
        'Không có bài đăng nào.',
        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
    )
        : SingleChildScrollView(
      child: Column(
        children: posts.map((post) => Post(post: post)).toList(),
      ),
    );
  }
}

