import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthStorage {
  final FlutterSecureStorage _storage = FlutterSecureStorage();

  Future<void> storeAuthData(Map<String, dynamic> data) async {
    await _storage.write(key: 'token', value: data['token']);
    await _storage.write(key: 'avatar', value: data['avatar']);
    await _storage.write(key: 'userName', value: data['userName']);
    await _storage.write(key: 'roles', value: jsonEncode(data['roles']));
    await _storage.write(key: 'likePost', value: jsonEncode(data['likePost']));
    await _storage.write(
        key: 'unreadMessageCount', value: data['unreadMessageCount'].toString());
  }

  Future<Map<String, dynamic>> getAuthData() async {
    final token = await _storage.read(key: 'token');
    final avatar = await _storage.read(key: 'avatar');
    final userName = await _storage.read(key: 'userName');
    final roles = (await _storage.read(key: 'roles'));
    final likePost =
        (await _storage.read(key: 'likePost'));
    final unreadMessageCount =
    int.tryParse(await _storage.read(key: 'unreadMessageCount') ?? '0');

    return {
      'token': token,
      'avatar': avatar,
      'userName': userName,
      'roles': jsonDecode(roles!),
      'likePost': jsonDecode(likePost!),
      'unreadMessageCount': unreadMessageCount,
    };
  }

  Future<void> clearAuthData() async {
    await _storage.deleteAll();
  }
}
