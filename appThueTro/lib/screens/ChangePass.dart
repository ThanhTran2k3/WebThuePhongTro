import 'package:appthuetro/api/AuthAPI.dart';
import 'package:appthuetro/screens/ForgotPasswordPage.dart';
import 'package:flutter/material.dart';


class ChangePass extends StatefulWidget {
  final String token;
  final String email;
  const ChangePass({required this.token,required this.email, Key? key}) : super(key: key);

  @override
  _ChangePassState createState() => _ChangePassState();
}

class _ChangePassState extends State<ChangePass> {
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  bool showCurrentPassword = false;
  bool showNewPassword = false;
  bool showConfirmPassword = false;
  String error = '';

  void togglePassword(bool currentValue, Function updatePasswordState) {
    setState(() {
      updatePasswordState(!currentValue);
    });
  }

  void validatePasswords(String confirmPassword) {
    final newPassword = newPasswordController.text.trim();
    if (newPassword != confirmPassword) {
      setState(() {
        error = 'Mật khẩu không khớp!';
      });
    } else {
      setState(() {
        error = '';
      });
    }
  }

  Future<void> handleChangePass() async {
    final password = passwordController.text.trim();
    final newPassword = newPasswordController.text.trim();

    if (password.isEmpty || newPassword.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng nhập đầy đủ thông tin!')),
      );
      return;
    }
    AuthAPI().changePass(context, widget.token, password, newPassword);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Đổi mật khẩu')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: passwordController,
              obscureText: !showCurrentPassword,
              decoration: InputDecoration(
                labelText: 'Mật khẩu hiện tại',
                suffixIcon: IconButton(
                  icon: Icon(
                    showCurrentPassword
                        ? Icons.visibility_off
                        : Icons.visibility,
                  ),
                  onPressed: () {
                    togglePassword(showCurrentPassword, (value) {
                      showCurrentPassword = value;
                    });
                  },
                ),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: newPasswordController,
              obscureText: !showNewPassword,
              decoration: InputDecoration(
                labelText: 'Mật khẩu mới',
                suffixIcon: IconButton(
                  icon: Icon(
                    showNewPassword ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () {
                    togglePassword(showNewPassword, (value) {
                      showNewPassword = value;
                    });
                  },
                ),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: confirmPasswordController,
              obscureText: !showConfirmPassword,
              decoration: InputDecoration(
                labelText: 'Xác nhận mật khẩu',
                suffixIcon: IconButton(
                  icon: Icon(
                    showConfirmPassword ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () {
                    togglePassword(showConfirmPassword, (value) {
                      showConfirmPassword = value;
                    });
                  },
                ),
              ),
              onChanged: validatePasswords,
            ),
            SizedBox(height: 16),
            if (error.isNotEmpty)
              Text(
                error,
                style: TextStyle(color: Colors.red, fontSize: 14),
              ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => ForgotPasswordPage(token: widget.token,email: widget.email,)),
                    );
                  },
                  child: Text('Quên mật khẩu?'),
                ),
              ],
            ),
            ElevatedButton(
              onPressed: error.isEmpty ? handleChangePass : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.indigo,
                minimumSize: Size(double.infinity, 50),
              ),
              child: Text(
                'Đổi mật khẩu',
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
