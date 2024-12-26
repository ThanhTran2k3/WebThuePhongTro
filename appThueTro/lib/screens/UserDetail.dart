import 'package:appthuetro/api/UserAPI.dart';
import 'package:appthuetro/widgets/ListPost.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';


class UserDetail extends StatefulWidget {
  final String userName;

  const UserDetail({required this.userName, Key? key}) : super(key: key);

  @override
  _UserDetailState createState() => _UserDetailState();
}


class _UserDetailState extends State<UserDetail> {
  late Future<Map<String, dynamic>> userInfo;
  late Future<Map<String, dynamic>> userPost;
  late List<dynamic> posts = [];
  String currentView = "post";
  int page = 1;
  bool load = true;

  @override
  void initState() {
    super.initState();
    userInfo = UserAPI().getInfoUser(widget.userName);
  }

  String formatJoinDate(String joinDate) {
    DateTime parsedDate = DateTime.parse(joinDate);
    return DateFormat('dd-MM-yyyy').format(parsedDate);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<Map<String, dynamic>>(
        future: userInfo,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return Center(child: Text('Không có bài đăng!'));
          } else {
            final userInfo = snapshot.data!;
            userPost = UserAPI().getPostUser(userInfo['userName'], "postDisplays", page);
            final imageUrl = 'http://10.0.2.2:8080${userInfo['avatar']}';

            return Scaffold(
              appBar: AppBar(
                title: Text(userInfo['userName']),
              ),
              body: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundImage: NetworkImage(imageUrl),
                      backgroundColor: Colors.transparent,
                    ),
                    const SizedBox(height: 12.0),
                    Padding(
                      padding: const EdgeInsets.only(left: 20.0),
                      child: Text(
                        userInfo['userName'],
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          flex: 2,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.phone, color: Colors.black),
                                  const SizedBox(width: 8.0),
                                  Expanded(
                                    child: Text(
                                      userInfo['phoneNumber'],
                                      style: const TextStyle(fontSize: 14.0, color: Colors.black),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8.0),
                              Row(
                                children: [
                                  Icon(Icons.email, color: Colors.black),
                                  const SizedBox(width: 8.0),
                                  Expanded(
                                    child: Text(
                                      userInfo['email'],
                                      style: const TextStyle(fontSize: 14.0, color: Colors.black),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8.0),
                              Row(
                                children: [
                                  Icon(Icons.location_on, color: Colors.black),
                                  const SizedBox(width: 8.0),
                                  Expanded(
                                    child: Text(
                                      '${userInfo['district']}, ${userInfo['city']}',
                                      style: const TextStyle(fontSize: 14.0, color: Colors.black),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8.0),
                              Row(
                                children: [
                                  Icon(Icons.access_time, color: Colors.black),
                                  const SizedBox(width: 8.0),
                                  Expanded(
                                    child: Text(
                                      'Tham gia ${formatJoinDate(userInfo['joinDate'])}',
                                      style: const TextStyle(fontSize: 14.0, color: Colors.black),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        Expanded(
                          flex: 1,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              ElevatedButton.icon(
                                onPressed: () {},
                                icon: const Icon(Icons.message),
                                label: const Text('Nhắn tin'),
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16.0),
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            children: [
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    currentView = "post";
                                    load = false;
                                  });
                                },
                                child: Text(
                                  "Bài đăng",
                                  style: TextStyle(
                                    color: currentView == "post" ? Colors.orange : Colors.black,
                                  ),
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: currentView == "post" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                        Expanded(
                          child: Column(
                            children: [
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    currentView = "reviews";
                                    load = false;
                                  });
                                },
                                child: Text(
                                  "Đánh giá",
                                  style: TextStyle(
                                    color: currentView == "reviews" ? Colors.orange : Colors.black,
                                  ),
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: currentView == "reviews" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    if (currentView == "post") ...[
                      FutureBuilder<Map<String, dynamic>>(
                        future: userPost,
                        builder: (context, postSnapshot) {
                          if (postSnapshot.connectionState == ConnectionState.waiting) {
                            return Center(child: CircularProgressIndicator());
                          } else if (postSnapshot.hasError) {
                            return Center(child: Text('Error: ${postSnapshot.error}'));
                          } else if (!postSnapshot.hasData || postSnapshot.data == null) {
                            return Center(child: Text('Không có bài đăng!'));
                          } else {
                            final postData = postSnapshot.data!;
                            final totalPage = postData['totalPage'];
                            if(load)
                              posts.addAll(postData['content']);
                            return Column(
                              children: [
                                ListPost(posts: posts),
                                if (page < totalPage)
                                  ElevatedButton(
                                    onPressed: () {
                                      setState(() {
                                        load = true;
                                        page++;
                                        userPost = UserAPI().getPostUser(userInfo['userName'], "postDisplays", page);
                                      });
                                    },
                                    child: const Text('Xem thêm'),
                                  ),
                              ],
                            );
                          }
                        },
                      ),
                    ],
                  ],
                ),
              ),
            );
          }
        },
      ),
    );
  }
}

