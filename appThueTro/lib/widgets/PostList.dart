
import 'package:appthuetro/widgets/PostCard.dart';
import 'package:flutter/material.dart';

class PostList extends StatelessWidget  {
  final List<dynamic> posts;

  const PostList({required this.posts, Key? key}) : super(key: key);


  @override
  Widget build(BuildContext context) {
    return posts.isEmpty
        ? Center(
      child: Text(
        'Không có bài đăng nào.',
        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
    )
        : SizedBox(
      height: MediaQuery.of(context).size.height / 2-120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: posts.length,
        itemBuilder: (context, index) {
          var post = posts[index];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2.0),
            child: SizedBox(
              width: MediaQuery.of(context).size.width / 2,
              child: PostCard(post: post),
            ),
          );
        },
      ),
    );
  }




}

