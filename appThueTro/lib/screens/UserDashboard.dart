import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/UserAPI.dart';
import 'package:appthuetro/main.dart';
import 'package:appthuetro/screens/ChangePass.dart';
import 'package:appthuetro/screens/EditUser.dart';
import 'package:appthuetro/screens/FavoritePost.dart';
import 'package:appthuetro/screens/HistoryPayment.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:appthuetro/screens/PaymentPage.dart';
import 'package:appthuetro/screens/UserDetail.dart';
import 'package:appthuetro/widgets/ButtonOption.dart';
import 'package:flutter/material.dart';

class UserDashboard extends StatefulWidget {
  @override
  _UserDashboardState createState() => _UserDashboardState();
}

class _UserDashboardState extends State<UserDashboard> {
  late final AuthStorage _authStorage;

  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: _authStorage.getAuthData(),
      builder: (context, snapshot) {
        if (snapshot.hasError || !snapshot.hasData || snapshot.data == null) {
          return LoginPage();
        }
        final token = snapshot.data!['token'];

        final apiResponse = UserAPI().getUser(token);
        return FutureBuilder<Map<String, dynamic>>(
          future: apiResponse,
          builder: (context, userSnapshot) {
            if (userSnapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            }
            if (userSnapshot.hasError || !userSnapshot.hasData || userSnapshot.data == null) {
              return LoginPage();
            }
            final data = userSnapshot.data!;
            final userInfo = data['result'];
            final imageUrl = 'http://10.0.2.2:8080${userInfo['avatar']}';
            return Scaffold(
              body: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(8.0,8.0,0.0,8.0),
                          child: CircleAvatar(
                            radius: 30,
                            backgroundImage: NetworkImage(imageUrl),
                            backgroundColor: Colors.transparent,
                          ),
                        ),
                        SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) => UserDetail(userName: userInfo['userName'])),
                                );
                              },
                              child: Text(
                                userInfo['userName'],
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            SizedBox(height: 6),
                            Text(
                              'Số dư: ${userInfo['balance']} đ',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.red[600],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: GestureDetector(
                        onTap: (){
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => FavoritePost()),
                          );
                        },
                        child: ButtonOption(Icons.favorite, "Yêu thích"),
                      ),
                    ),
                    Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: GestureDetector(
                        onTap: (){
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => PaymentPage(userName: userInfo['userName'],)),
                          );
                        },
                        child: ButtonOption(Icons.attach_money, "Nạp tiền"),
                      ),
                    ),

                    Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: GestureDetector(
                        onTap: (){
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => EditUser(token: token,userInfo: userInfo,)),
                          );
                        },
                        child: ButtonOption(Icons.manage_accounts, "Thông tin cá nhân"),
                      ),
                    ),
                    Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: GestureDetector(
                        onTap: (){
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => ChangePass(token: token,email: userInfo['email'],)),
                          );
                        },
                        child: ButtonOption(Icons.password, "Đổi mật khẩu"),
                      ),
                    ),
                    Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: GestureDetector(
                        onTap: (){
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => HistoryPayment(token: token,)),
                          );
                        },
                        child: ButtonOption(Icons.history, "Lịch sử nạp tiền"),
                      ),
                    ),

                    Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: GestureDetector(
                        onTap: (){
                          _authStorage.clearAuthData();
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => MyApp()),
                          );
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Đăng xuất thành công')),
                          );
                        },
                        child: ButtonOption(Icons.exit_to_app, "Đăng xuất"),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
