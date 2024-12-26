
import 'package:appthuetro/widgets/PostManager.dart';
import 'package:flutter/material.dart';

class ListPostManager extends StatelessWidget  {
  final List<dynamic> posts;
  final Function(String, String) onUpdatePost;

  const ListPostManager({required this.posts,required this.onUpdatePost, Key? key}) : super(key: key);


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
        children: posts.map((post) => PostManager(post: post,onUpdate: onUpdatePost,)).toList(),
      ),
    );
  }
}

