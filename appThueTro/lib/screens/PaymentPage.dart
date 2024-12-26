import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/PaymentAPI.dart';
import 'package:flutter/material.dart';

class PaymentPage extends StatefulWidget {
  final String userName;

  const PaymentPage({required this.userName, Key? key}) : super(key: key);

  @override
  _PaymentPageState createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  TextEditingController paymentController = TextEditingController();
  String selectedPaymentMethod = "Momo";
  late final AuthStorage _authStorage;

  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
  }

  void handlePayment() async {
    String payment = paymentController.text.trim();
    if (payment.isEmpty) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Oops..."),
          content: Text("Vui lòng nhập số tiền!"),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text("OK"),
            ),
          ],
        ),
      );
      return;
    }
    final data = await _authStorage.getAuthData();
    await PaymentAPI().payment(context,data['token'], payment);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Nạp tiền"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                initialValue: widget.userName,
                readOnly: true,
                decoration: InputDecoration(
                  labelText: "Tên tài khoản",
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: paymentController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: "Số tiền nạp",
                  border: OutlineInputBorder(),
                  suffixText: "đ",
                ),
              ),
              SizedBox(height: 8),
              Text(
                "Số tiền tối thiểu: 1000đ",
                style: TextStyle(color: Colors.red, fontSize: 12),
              ),
              SizedBox(height: 16),

              Text("Phương thức thanh toán", style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              RadioListTile<String>(
                value: "Momo",
                groupValue: selectedPaymentMethod,
                onChanged: (value) {
                  setState(() {
                    selectedPaymentMethod = value!;
                  });
                },
                title: Row(
                  children: [
                    Image.asset(
                      "assets/images/momo.jpg",
                      width: 40,
                      height: 40,
                    ),
                    SizedBox(width: 8),
                    Text("Momo"),
                  ],
                ),
              ),
              SizedBox(height: 24),

              ElevatedButton(
                onPressed: handlePayment,
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.indigo,
                ),
                child: Text(
                  "Nạp tiền",
                  style: TextStyle(color:Colors.white,fontSize: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
