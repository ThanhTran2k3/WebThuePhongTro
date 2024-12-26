import 'dart:convert';

import 'package:appthuetro/api/ChatAPI.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:web_socket_channel/web_socket_channel.dart';


class Chat extends StatefulWidget {
  final String token;
  final String userChat;
  final String currentUser;
  const Chat({super.key, required this.token, required this.userChat, required this.currentUser});

  @override
  State<Chat> createState() => _ChatState();
}


class _ChatState extends State<Chat> {
  late WebSocketChannel channel;
  List<dynamic> messages = [];
  bool show = true;
  String messageContent = '';
  Map<String, dynamic>? selectedMessage;
  ScrollController _scrollController = ScrollController();


  @override
  void initState() {
    super.initState();
    loadData(context);
    _connectWebSocket();
  }

  void loadData(BuildContext context) async {
    final data = await ChatAPI().getDetailChat(widget.token, widget.userChat);
    setState(() {
      messages  = data;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
  }

  void _connectWebSocket() {
    channel = WebSocketChannel.connect(
      Uri.parse('ws://10.0.2.2:8080/ws'),
    );


    // Lắng nghe tin nhắn từ máy chủ
    channel.stream.listen((message) {
      final data = json.decode(message);

      print("ffhjshjkfshj");
    }, onError: (error) {
      print('WebSocket error: $error');
    }, onDone: () {
      print('WebSocket connection closed');
    });
  }

  void _scrollToBottom() {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );

  }

  String formatJoinDate(String time) {
    DateTime parsedDate = DateTime.parse(time);
    return DateFormat('dd-MM-yyyy HH:mm').format(parsedDate);
  }

  void sendMessage() {
    if (messageContent.isNotEmpty) {
      setState(() {
        // messages.add(Message(
        //   messageId: messages.length.toString(),
        //   senderName: 'Current User', // Thay thế bằng tên người dùng hiện tại
        //   content: messageContent,
        //   timestamp: DateTime.now(),
        //   avatarSender: 'avatar_url', // Thay bằng URL avatar của người gửi
        // ));
        messageContent = ''; // Reset nội dung tin nhắn
      });
    }
  }

  void handleMessageClick(Map<String, dynamic> message) {
    setState(() {
      selectedMessage = selectedMessage == message ? null : message;
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.userChat)),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final msg = messages[index];
                final isSent = msg['senderName'] == widget.currentUser;

                return Container(
                  padding: EdgeInsets.symmetric(vertical: 10, horizontal: 15),
                  child: Row(
                    mainAxisAlignment:
                    isSent ? MainAxisAlignment.end : MainAxisAlignment.start,
                    children: [
                      if (!isSent)
                        CircleAvatar(
                          backgroundImage: NetworkImage('http://10.0.2.2:8080${msg['avatarSender']}'),
                        ),
                      SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: isSent ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                        children: [
                          if (!msg['status'] && msg['senderName'] != widget.currentUser && show)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 5),
                              child: Text(
                                'Tin nhắn chưa đọc',
                                style: TextStyle(color: Colors.red),
                              ),
                            ),
                          GestureDetector(
                            onTap: () => handleMessageClick(msg),
                            child: Container(
                              padding: EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: isSent ? Colors.blue : Colors.grey[300],
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                msg['content'],
                                style: TextStyle(color: isSent ? Colors.white : Colors.black),
                              ),
                            ),
                          ),
                          SizedBox(height: 5),
                          if(selectedMessage == msg)
                              Text(
                                formatJoinDate(msg['timestamp'].toString()),
                                style: TextStyle(fontSize: 12),
                              ),



                        ],
                      ),
                      // if (isSent)
                      //   CircleAvatar(
                      //     backgroundImage: NetworkImage('http://10.0.2.2:8080${msg['avatarSender']}'),
                      //   ),
                    ],
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Nhập tin nhắn',
                      border: OutlineInputBorder(),
                    ),
                    onChanged: (text) {
                      setState(() {
                        messageContent = text;
                      });
                    },
                    controller: TextEditingController(text: messageContent),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send,color: Colors.blueAccent,),
                  onPressed: (){},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
