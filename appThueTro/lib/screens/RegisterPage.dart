import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/AuthAPI.dart';
import 'package:appthuetro/main.dart';
import 'package:flutter/material.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPage createState() => _RegisterPage();
}

class _RegisterPage extends State<RegisterPage> {
  final TextEditingController userNameController = TextEditingController();
  final TextEditingController phoneNumberController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  bool showPassword = false;
  bool showConfirmPassword = false;
  String error = '';

  void togglePassword(bool currentValue, Function updatePasswordState) {
    setState(() {
      updatePasswordState(!currentValue);
    });
  }

  void validatePasswords(String confirmPassword) {
    final password = passwordController.text.trim();
    if (password != confirmPassword) {
      setState(() {
        error = 'Mật khẩu không khớp!';
      });
    } else {
      setState(() {
        error = '';
      });
    }
  }

  void _register(BuildContext context) async {
    final username = userNameController.text.trim();
    final email = emailController.text.trim();
    final password = passwordController.text.trim();
    final phoneNumber = phoneNumberController.text.trim();
    if (username.isEmpty || password.isEmpty || phoneNumber.isEmpty||email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng nhập đầy đủ thông tin')),
      );
      return;
    }
    await  AuthAPI().register(context,username,email, phoneNumber, password);
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Image.asset(
                'assets/images/user.png',
                height: 100,
              ),
              SizedBox(height: 30),
              TextField(
                controller: userNameController,
                decoration: InputDecoration(
                  labelText: 'Tên người dùng',
                ),
              ),
              SizedBox(height: 20),
              TextField(
                controller: phoneNumberController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: "Số điện thoại",
                ),
              ),
              SizedBox(height: 20),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  labelText: 'Email',
                ),
              ),
              SizedBox(height: 20),
              TextField(
                controller: passwordController,
                obscureText: !showPassword,
                decoration: InputDecoration(
                  labelText: 'Mật khẩu',
                  suffixIcon: IconButton(
                    icon: Icon(
                      showPassword ? Icons.visibility_off : Icons.visibility,
                    ),
                    onPressed: () {
                      togglePassword(showPassword, (value) {
                        showPassword = value;
                      });
                    },
                  ),
                ),
              ),
              SizedBox(height: 20),
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
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => _register(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  padding: EdgeInsets.symmetric(vertical: 15),
                ),
                child: Text(
                  'Đăng ký',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text(
                  'Trở về',
                  style: TextStyle(color: Colors.indigo, fontSize: 14),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
