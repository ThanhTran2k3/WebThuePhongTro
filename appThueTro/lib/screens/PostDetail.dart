import 'dart:convert';

import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/PostAPI.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:appthuetro/screens/UserDetail.dart';
import 'package:appthuetro/widgets/PostList.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';

class PostDetail extends StatefulWidget {
  final int postId;

  const PostDetail({required this.postId, Key? key}) : super(key: key);

  @override
  _PostDetailState createState() => _PostDetailState();
}

class _PostDetailState extends State<PostDetail> {
  late Map<String, dynamic> postDetail;
  late final AuthStorage _authStorage;
  late final FlutterSecureStorage _storage;
  bool isLiked = false;
  List<dynamic> listPost = [];

  @override
  void initState() {
    super.initState();
    postDetail={};
    _authStorage = AuthStorage();
    _loadAuthData();
    _storage = FlutterSecureStorage();
  }

  Future<void> _loadAuthData() async {
      postDetail = await PostAPI().getPostDetail(widget.postId);

    try {
      final data = await _authStorage.getAuthData();
      listPost = data['likePost'] ?? '[]';
      setState(() {
        isLiked = listPost.any((post) => post['postId'] == widget.postId);
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

  String timeAgo(String postedAt) {
    final now = DateTime.now();
    final postedDate = DateTime.parse(postedAt);
    final diffMs = now.difference(postedDate).inMilliseconds;

    final diffSec = diffMs ~/ 1000;
    final diffMin = diffSec ~/ 60;
    final diffHour = diffMin ~/ 60;
    final diffDay = diffHour ~/ 24;
    final diffMonth = diffDay ~/ 30;

    if (diffMonth > 0) {
      return '$diffMonth tháng trước';
    } else if (diffDay > 0) {
      return '$diffDay ngày trước';
    } else if (diffHour > 0) {
      return '$diffHour giờ trước';
    } else if (diffMin > 0) {
      return '$diffMin phút trước';
    } else {
      return '$diffSec giây trước';
    }
  }


  @override
  Widget build(BuildContext context) {
      if (postDetail.isEmpty) {
        return Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        );
      }
            final post = postDetail['post'];
            final user = postDetail['userCreate'];
            final postNear = postDetail['postNear'];
            final imageUrl = 'http://10.0.2.2:8080${post['postImages'][0]['urlImage']}';
            final screenHeight = MediaQuery.of(context).size.height;
            double latitude = post['latitude'];
            double longitude = post['longitude'];
            LatLng postLocation = LatLng(latitude, longitude);
            Set<Marker> _markers = {
              Marker(
                markerId: MarkerId('postLocation'),
                position: postLocation,
                infoWindow: InfoWindow(
                  title: 'Tọa độ bài đăng',
                  snippet: '(${latitude.toStringAsFixed(6)}, ${longitude.toStringAsFixed(6)})',
                ),
              ),
            };


            return Scaffold(
              appBar: AppBar(
                title: Text(post['title']),
              ),
              body: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8.0),
                      child: Image.network(
                        imageUrl,
                        width: double.infinity,
                        height: screenHeight * 0.3,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(height: 12.0),
                    Text(
                      post['title'],
                      style: const TextStyle(
                          fontSize: 20.0,
                          fontWeight: FontWeight.bold
                      ),
                    ),
                    const SizedBox(height: 8.0),
                    Row(
                      children: [
                        Text(
                          '${formatRentPrice(post['rentPrice'])} đ/tháng',
                          style: TextStyle(
                              fontSize: 16.0,
                              color: Colors.red[600],
                              fontWeight: FontWeight.bold
                          ),
                        ),
                        const SizedBox(width: 8.0),
                        Text(
                          '- ${post['area']} m\u00B2',
                          style: TextStyle(
                              fontSize: 14.0,
                              color: Colors.grey[600],
                              fontWeight: FontWeight.bold
                          ),
                        ),
                        const SizedBox(width: 50.0),
                        IconButton(
                          icon: Icon(
                            isLiked ? Icons.favorite : Icons.favorite_border,
                            color: Colors.red,
                            size: 24.0,
                          ),
                          onPressed: () {
                            handleLike(context,widget.postId);
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8.0),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.location_on, color: Colors.black),
                            const SizedBox(width: 8.0),
                            Expanded(
                              child: Text(
                                '${post['address']}, ${post['wards']}, ${post['district']}, ${post['city']}',
                                style: TextStyle(fontSize: 14.0, color: Colors.black),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 8.0),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.timer, color: Colors.black),
                            const SizedBox(width: 8.0),
                            Expanded(
                              child: Text(
                                'Đăng: ${timeAgo(post['postingDate'])}',
                                style: TextStyle(fontSize: 14.0, color: Colors.black),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 8.0),
                    if (post['status']&&(post['approvalStatus'] ?? false) == true&&DateTime.parse(post['postingDate']).isBefore(DateTime.now())) ...[
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.check, color: Colors.black),
                              const SizedBox(width: 8.0),
                              Expanded(
                                child: Text(
                                  'Tin đã kiểm duyệt',
                                  style: TextStyle(fontSize: 14.0, color: Colors.black),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ]else ...[
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.close, color: Colors.black),
                              const SizedBox(width: 8.0),
                              Expanded(
                                child: Text(
                                  'Tin chưa được kiểm duyệt',
                                  style: TextStyle(fontSize: 14.0, color: Colors.black),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                    const SizedBox(height: 8.0),
                    if (post['postCategory']['postCategoryId'] ==3) ...[
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.arrow_upward, color: Colors.black),
                              const SizedBox(width: 8.0),
                              Expanded(
                                child: Text(
                                  'Tin ưu tiên',
                                  style: TextStyle(
                                    color: Colors.black87,
                                    fontSize: 14.0,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                    const SizedBox(height: 8.0),
                    Row(
                      children: [
                        CircleAvatar(
                          backgroundImage: NetworkImage('http://10.0.2.2:8080${user['avatar']}'),
                        ),
                        const SizedBox(width: 8.0),
                        Text(user['userName'], style: const TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold
                        )),
                        const SizedBox(width: 130.0),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => UserDetail(userName: user['userName']),
                              ),
                            );
                          },
                          style: TextButton.styleFrom(
                            side: const BorderSide(color: Colors.green, width: 2.0),
                            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                            backgroundColor: Colors.green,
                          ),
                          child: const Text(
                            'Xem trang',
                            style: TextStyle(fontSize: 16.0, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16.0),
                    Text(
                      'Đặc điểm',
                      style: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
                    ),
                    GridView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 8.0,
                        mainAxisSpacing: 8.0,
                        childAspectRatio: 2,
                      ),
                      itemCount: 3,
                      itemBuilder: (context, index) {
                        List<Map<String, String>> features = [
                          {'title': 'Tiền thuê', 'value': '${formatRentPrice(post['rentPrice'])} đ/tháng'},
                          {'title': 'Diện tích', 'value': '${post['area']} m\u00B2'},
                          {'title': 'Tiền cọc', 'value': '${formatRentPrice(post['rentPrice'])} đ'},
                        ];
                        return Card(
                          elevation: 2.0,
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  features[index]['title']!,
                                  style: const TextStyle(fontSize: 16.0,fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 4.0),
                                Text(
                                  features[index]['value']!,
                                  style: const TextStyle(fontSize: 14.0),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 16.0),
                    Text(
                      'Mô tả',
                      style: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
                    ),
                    Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          post['description'],
                          style: const TextStyle(fontSize: 14.0),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    Card(
                      elevation: 4.0,
                      margin: EdgeInsets.all(10.0),
                      child: Container(
                        height: 250.0,
                        child: GoogleMap(
                          initialCameraPosition: CameraPosition(
                            target: postLocation,
                            zoom: 14.0,
                          ),
                          markers: _markers,
                          mapType: MapType.normal,
                          onMapCreated: (GoogleMapController controller) {
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(
                              'Gần đây',
                              style: const TextStyle(
                                  fontSize: 20.0,
                                  fontWeight: FontWeight.bold
                              ),
                            ),
                          ),
                          PostList(posts: postNear),
                        ],
                      ),
                    )

                  ],
                ),
              ),
            );




  }
}
