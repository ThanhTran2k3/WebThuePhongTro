import 'dart:async';
import 'package:appthuetro/api/AuthAPI.dart';
import 'package:appthuetro/api/OtpAPI.dart';
import 'package:appthuetro/api/UserAPI.dart';
import 'package:flutter/material.dart';


class ForgotPasswordPage extends StatefulWidget {
  final String token;
  final String email;
  const ForgotPasswordPage({required this.token,required this.email, Key? key}) : super(key: key);

  @override
  _ForgotPasswordPageState createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController otpController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  Map<String, dynamic>? userInfo = {};
  String selectedPaymentMethod = "Email";
  int currentStep = 1;
  String error = '';
  int timeLeft = 60;
  Timer? _timer;
  bool showNewPassword = false;
  bool showConfirmPassword = false;


  @override
  void initState() {
    super.initState();
    loadData();
  }


  Future<void> loadData() async {
    if (widget.token.isNotEmpty) {
      try {
        final apiResponse = await UserAPI().getUser(widget.token);
        if (apiResponse.containsKey('result')) {
          setState(() {
            userInfo = apiResponse['result'];
          });
        } else {
          print("Lỗi: Không có thông tin user hợp lệ từ API.");
        }
      } catch (e) {
        print("Lỗi khi load dữ liệu: $e");
      }
    } else {
      setState(() {
        currentStep = 0;
      });;
    }
  }

  Future<void> sendOTP() async {
    String email = widget.email.length==0?emailController.text:widget.email;
    bool success = await OtpAPI().sendOTP(context, email);
    if (success) {
      setState(() {
        currentStep = 2;
        timeLeft = 60;
        startTimer();
      });

    }
  }

  void startTimer() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (timeLeft > 0) {
        setState(() {
          timeLeft--;
        });
      } else {
        _timer?.cancel();
      }
    });
  }

  Future<void> verifyOTP() async {
    if (otpController.text.trim().isEmpty) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: Text("Vui lòng nhập OTP!"),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
      return;
    }
    String otp = otpController.text;
    bool success = await OtpAPI().verifyOTPEmail(widget.email.length==0?emailController.text:widget.email, otp);
    if (success) {
      setState(() {
        currentStep = 3;
      });
    } else {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: Text("OTP không chính xác!"),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
    }
  }

  Future<void> changePassword() async {
    final newPassword = newPasswordController.text.trim();
    final confirmPassword = confirmPasswordController.text.trim();

    if (newPassword.isEmpty || confirmPassword.isEmpty) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: Text("Vui lòng nhập đầy đủ thông tin!"),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("OK"),
            ),
          ],
        ),
      );
      return;
    }

    if (newPassword != confirmPassword) {
      setState(() {
        error = 'Mật khẩu không khớp!';
      });
      return;
    }
    String email = widget.email.length==0?emailController.text:widget.email;
    AuthAPI().changePassOTP(context, email, newPassword);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Quên mật khẩu")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: currentStep ==0? _buildEmailSection(): currentStep ==1 ? _buildSendOTPSection()
            : currentStep==2?_buildOTPVerificationSection()
            : _buildNewPasswordSection(),
      ),
    );
  }

  Widget _buildSendOTPSection() {
    if (userInfo == null) {
      return SizedBox();
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        userInfo?['avatar'] != null
            ? CircleAvatar(
          radius: 50,
          backgroundImage: NetworkImage("http://10.0.2.2:8080${userInfo?['avatar']}"),
        )
            : SizedBox(),

        SizedBox(height: 20),

        userInfo?['email'] != null
            ? RadioListTile<String>(
          value: "Email",
          groupValue: selectedPaymentMethod,
          onChanged: (value) {
            setState(() {
              selectedPaymentMethod = value!;
            });
          },
          title: Row(
            children: [
              Text(userInfo?['email'] ?? ""),
            ],
          ),
        )
            : SizedBox(),
        SizedBox(height: 20),

        ElevatedButton(
          onPressed: sendOTP,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigo,
          ),
          child: Text("Gửi OTP", style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }

  Widget _buildEmailSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        TextField(
          controller: emailController,
          decoration: InputDecoration(labelText: 'Email'),
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: sendOTP,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigo,
          ),
          child: Text("Gửi OTP",style: TextStyle(color: Colors.white)),
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
    );
  }

  Widget _buildOTPVerificationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        TextField(
          controller: otpController,
          decoration: InputDecoration(labelText: 'Mã OTP'),
        ),
        SizedBox(height: 20),
        if(timeLeft > 0)
          Text(
            "Thời gian còn lại: $timeLeft giây",
            style: TextStyle(color: Colors.red),
          ),
        if (timeLeft == 0)
          TextButton(
            onPressed: sendOTP,
            child: Text("Gửi lại"),
          ),
        ElevatedButton(
          onPressed: verifyOTP,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigo,
          ),
          child: Text("Xác thực",style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }

  Widget _buildNewPasswordSection() {
    return Column(
      children: [
        TextField(
          controller: newPasswordController,
          obscureText: !showNewPassword,
          decoration: InputDecoration(
            labelText: 'Mật khẩu mới',
            suffixIcon: IconButton(
              icon: Icon(showNewPassword ? Icons.visibility_off : Icons.visibility),
              onPressed: () => setState(() => showNewPassword = !showNewPassword),
            ),
          ),
        ),
        TextField(
          controller: confirmPasswordController,
          obscureText: !showConfirmPassword,
          onChanged: (value) {
            if (newPasswordController.text != value) {
              setState(() => error = 'Mật khẩu không khớp!');
            } else {
              setState(() => error = '');
            }
          },
          decoration: InputDecoration(
            labelText: 'Xác nhận mật khẩu',
            suffixIcon: IconButton(
              icon: Icon(showConfirmPassword ? Icons.visibility_off : Icons.visibility),
              onPressed: () => setState(() => showConfirmPassword = !showConfirmPassword),
            ),
          ),
        ),
        SizedBox(height: 16),
        if (error.isNotEmpty)
          Text(
            error,
            style: TextStyle(color: Colors.red, fontSize: 14),
          ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: error.isEmpty ? changePassword : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigo,
          ),
          child: Text("Đổi mật khẩu",style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }
}
