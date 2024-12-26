import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/widgets/ListPost.dart';
import 'package:flutter/material.dart';


class FavoritePost extends StatefulWidget {
  @override
  _FavoritePost createState() => _FavoritePost();
}

class _FavoritePost extends State<FavoritePost> {
  List<dynamic> post = [];
  late final AuthStorage _authStorage;

  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
    _loadAuthData();
  }

  Future<void> _loadAuthData() async {
    try {
      final data = await _authStorage.getAuthData();
      setState(() {
        final postLike = data['likePost'] ?? '[]';
        post = postLike;
      });

    } catch (e) {
      print('Error loading auth data: $e');
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Yêu thích"),
        ),
        body: ListPost(posts: post)
    );
  }
}
