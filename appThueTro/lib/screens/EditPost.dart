import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/PostAPI.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../widgets/FormPost.dart';

class EditPost extends StatefulWidget {
  final int postId;
  const EditPost({required this.postId, Key? key}) : super(key: key);

  @override
  _EditPostState createState() => _EditPostState();
}


class _EditPostState extends State<EditPost> {
  Map<String, dynamic>? post;
  late final AuthStorage _authStorage;

  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
    _initializeData();
  }

  Future<void> _initializeData() async {
    await _loadAuthData();
  }

  Future<void> _loadAuthData() async {
    final data = await _authStorage.getAuthData();
    if (!data['token'].toString().isEmpty) {
      String token = data['token'];
      final result = await PostAPI().getPostById(context, token, widget.postId);
      setState(() {
        post = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (post == null) {
      return Center(child: CircularProgressIndicator());
    }
    return FormPost(post: post);
  }
}
