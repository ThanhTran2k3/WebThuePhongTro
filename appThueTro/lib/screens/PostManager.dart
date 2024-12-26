import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/UserAPI.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:appthuetro/widgets/ListPost.dart';
import 'package:appthuetro/widgets/ListPostManager.dart';
import 'package:flutter/material.dart';

class PostManager extends StatefulWidget {
  @override
  _PostManagerState createState() => _PostManagerState();
}

class _PostManagerState extends State<PostManager> {
  late final AuthStorage _authStorage;
  late Future<Map<String, dynamic>> userPost;
  late List<dynamic> post = [];
  int page =1;
  String postType = "postDisplays";
  bool load = true;
  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
  }

  Future<void> fetchData(String userName, String? service, int page) async {
    userPost = UserAPI().getPostUser(userName, postType, page);
    final data = await userPost;
    final listPayment = data['content'];
    setState(() {
      if(page!=1)
        post.addAll(listPayment);
      else
        post = listPayment;
    });
  }

  void updatePostType(String userName,String postTypes) async {
    setState(() {
      postType = postTypes;
      page = 1;
    });
    await fetchData(userName, postType, page);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: _authStorage.getAuthData(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError || snapshot.data == null) {
          return LoginPage();
        }
        final userName = snapshot.data!['userName'];
        userPost = UserAPI().getPostUser(userName,postType,page);
        return FutureBuilder<Map<String, dynamic>>(
          future: userPost,
          builder: (context, userSnapshot) {
            if (userSnapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (userSnapshot.hasError) {
              return const Center(child: Text('Đã xảy ra lỗi khi tải dữ liệu.'));
            }
            if (!userSnapshot.hasData || userSnapshot.data == null) {
              return const Center(child: Text('Không có bài viết'));
            }
            final data = userSnapshot.data!;
            final totalPage = data['totalPage'];
            if(load){
              post = data['content'] ;
              load = false;
            }
            return Scaffold(
              body: Column(
                children: [
                  const SizedBox(height: 16.0),
                  Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              postType = "postDisplays";
                              page = 1;
                            });
                            await fetchData(userName, postType, page);
                          },
                          child: Column(
                            children: [
                              Text(
                                "Hiển thị",
                                style: TextStyle(
                                  color: postType == "postDisplays" ? Colors.orange : Colors.black,
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: postType == "postDisplays" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              postType = "postHidden";
                              page = 1;
                            });
                            await fetchData(userName, postType, page);
                          },
                          child: Column(
                            children: [
                              Text(
                                "Ẩn",
                                style: TextStyle(
                                  color: postType == "postHidden" ? Colors.orange : Colors.black,
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: postType == "postHidden" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              postType = "postExpired";
                              page = 1;
                            });
                            await fetchData(userName, postType, page);
                          },
                          child: Column(
                            children: [
                              Text(
                                "Hết hạn",
                                style: TextStyle(
                                  color: postType == "postExpired" ? Colors.orange : Colors.black,
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: postType == "postExpired" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              postType = "postPending";
                              page = 1;
                            });
                            await fetchData(userName, postType, page);
                          },
                          child: Column(
                            children: [
                              Text(
                                "Chờ duyệt",
                                style: TextStyle(
                                  color: postType == "postPending" ? Colors.orange : Colors.black,
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: postType == "postPending" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              postType = "postRejected";
                              page = 1;
                            });
                            await fetchData(userName, postType, page);
                          },
                          child: Column(
                            children: [
                              Text(
                                "Bị từ chối",
                                style: TextStyle(
                                  color: postType == "postRejected" ? Colors.orange : Colors.black,
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: postType == "postRejected" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  // Payment list display
                  Expanded(
                    child: ListPostManager(posts: post,onUpdatePost: updatePostType,)
                  ),
                  // 'Xem thêm' button for pagination
                  if (page < totalPage)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: ElevatedButton(
                        onPressed: () async {
                          setState(() {
                            page++;
                          });
                          await fetchData(userName, postType, page);
                        },
                        child: const Text('Xem thêm'),
                      ),
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
