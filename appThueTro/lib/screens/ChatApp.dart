import 'dart:convert';
import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/ChatAPI.dart';
import 'package:appthuetro/screens/Chat.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class ChatApp extends StatefulWidget {
  @override
  _ChatAppState createState() => _ChatAppState();
}

class _ChatAppState extends State<ChatApp> {
  late WebSocketChannel channel;
  late final AuthStorage _authStorage;
  List<dynamic> listUser = [];
  String token ="";
  String userName ="";

  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
    loadData(context);
    _connectWebSocket();
  }

  void loadData(BuildContext context) async {
    final userInfo = await _authStorage.getAuthData();
    if (userInfo['token'] == null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginPage()),
      );
      return;
    }
    setState(() {
      token = userInfo['token'];
      userName = userInfo['userName'];
    });
    final data = await ChatAPI().getListUserChat(userInfo['token']);
    setState(() {
      listUser = data;
    });

  }



  void _connectWebSocket() {

    channel = WebSocketChannel.connect(
      Uri.parse('ws://10.0.2.2:8080/ws'),
    );


    // Lắng nghe tin nhắn từ máy chủ
    channel.stream.listen((message) {
      final data = json.decode(message);

      setState(() {
        listUser = data;
      });
    }, onError: (error) {
      print('WebSocket error: $error');
    }, onDone: () {
      print('WebSocket connection closed');
    });
  }

  @override
  void dispose() {
    channel.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: listUser.isEmpty
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: listUser.length,
        itemBuilder: (context, index) {
          final user = listUser[index];
          return ListTile(
            leading: CircleAvatar(
              backgroundImage: NetworkImage('http://10.0.2.2:8080${user['avatar']}'),
            ),
            title: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(user['userName'] ,style: TextStyle(fontSize: 16),),
                SizedBox(width: 8),
                if (user['unreadMessageCount'] != 0)
                  Container(
                    padding: EdgeInsets.all(6.0),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      user['unreadMessageCount'].toString(),
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
              ],
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => Chat(token: token,userChat: user['userName'],currentUser: userName,),
                ),
              );
            },
          );

        },
      ),
    );
  }
}
