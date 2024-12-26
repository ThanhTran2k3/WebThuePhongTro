import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/screens/ChatApp.dart';
import 'package:appthuetro/screens/CreatePost.dart';
import 'package:appthuetro/screens/Home.dart';
import 'package:appthuetro/screens/PostManager.dart';
import 'package:appthuetro/screens/SearchPage.dart';
import 'package:appthuetro/screens/UserDashboard.dart';
import 'package:flutter/material.dart';
import 'package:convex_bottom_bar/convex_bottom_bar.dart';

void main() {
  runApp(MaterialApp(home: const MyApp(),
      debugShowCheckedModeBanner: false));
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver{
  int _selectedIndex = 0;
  late final AuthStorage _authStorage;

  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
    WidgetsBinding.instance.addObserver(this);
  }
  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.detached || state == AppLifecycleState.inactive) {
      _authStorage.clearAuthData();
    }
  }

  final List<Widget> _screens = [
    Home(),
    SearchPage(),
    CreatePost(),
    PostManager(),
    UserDashboard(),
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.black,
          leading: Padding(
            padding: const EdgeInsets.all(8.0),
            child: SizedBox(
              height: 40,
              width: 40,
              child: Image.asset(
                'assets/images/logo.png',
                fit: BoxFit.contain,
              ),
            ),
          ),
          // actions: [
          //   IconButton(
          //     iconSize: 20,
          //     icon: const Icon(Icons.search, color: Colors.white),
          //     onPressed: () {
          //       Navigator.push(
          //         context,
          //         MaterialPageRoute(builder: (context) => SearchPage()),
          //       );
          //     },
          //   ),
          // ],
        ),
        body: IndexedStack(
          index: _selectedIndex,
          children: _screens,
        ),
        bottomNavigationBar: ConvexAppBar(
          items: const [
            TabItem(icon: Icons.home, title: 'Trang chủ'),
            TabItem(icon: Icons.search, title: 'Tìm kiếm'),
            TabItem(icon: Icons.add, title: 'Đăng tin'),
            TabItem(icon: Icons.post_add, title: 'Quản lý tin'),
            TabItem(icon: Icons.people, title: 'Tài khoản'),
          ],
          backgroundColor: Colors.black,
          onTap: (int index) {
            setState(() {
              _selectedIndex = index;
            });
          },
        ),
      ),
    );
  }
}
