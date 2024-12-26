import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/InvoiceAPI.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class HistoryPayment extends StatefulWidget {
  final String token;
  const HistoryPayment({required this.token, Key? key}) : super(key: key);


  @override
  State<HistoryPayment> createState() => _HistoryPaymentState();
}

class _HistoryPaymentState extends State<HistoryPayment> {
  late Future<Map<String, dynamic>> userPayment;
  late final AuthStorage _authStorage;
  String currentView = "all";
  String? currentService;
  int page = 1;
  late List<dynamic> payment = [];
  bool load = true;

  @override
  void initState() {
    super.initState();
    _authStorage = AuthStorage();
  }


  Future<void> fetchData(String token, String? service, int page) async {
    userPayment = InvoiceAPI().getInvoice(token, page, service);
    final data = await userPayment;
    final listPayment = data['content'];
    setState(() {
      if(page!=1)
        payment.addAll(listPayment);
      else
        payment = listPayment;
    });
  }

  String formatJoinDate(String joinDate) {
    DateTime parsedDate = DateTime.parse(joinDate);
    return DateFormat('dd-MM-yyyy HH:mm').format(parsedDate);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: _authStorage.getAuthData(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError || snapshot.data == null) {
          return LoginPage();
        }
        userPayment = InvoiceAPI().getInvoice(widget.token, page, currentService);
        return FutureBuilder<Map<String, dynamic>>(
          future: userPayment,
          builder: (context, userSnapshot) {
            if (userSnapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (userSnapshot.hasError) {
              return const Center(child: Text('Đã xảy ra lỗi khi tải dữ liệu.'));
            }
            if (!userSnapshot.hasData || userSnapshot.data == null) {
              return const Center(child: Text('Không có hóa đơn'));
            }
            final data = userSnapshot.data!;
            final totalPage = data['totalPage'];
            if(load){
              payment = data['content'];
              load = false;
            }
            return Scaffold(
              appBar: AppBar(
                title: Text("Lịch sử giao dịch"),
              ),
              body: Column(
                children: [
                  const SizedBox(height: 16.0),
                  Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              currentView = "all";
                              page = 1;
                              currentService = null;
                            });
                            await fetchData(widget.token, currentService, page);
                          },
                          child: Column(
                            children: [
                              Text(
                                "Tất cả",
                                style: TextStyle(
                                  color: currentView == "all" ? Colors.orange : Colors.black,
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: currentView == "all" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              currentView = "payment";
                              page = 1;
                              currentService = "Nạp tiền";
                            });
                            await fetchData(widget.token, currentService, page);
                          },
                          child: Column(
                            children: [
                              Text(
                                "Nạp tiền",
                                style: TextStyle(
                                  color: currentView == "payment" ? Colors.orange : Colors.black,
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: currentView == "payment" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            setState(() {
                              currentView = "service";
                              page = 1;
                              currentService = "service";
                            });
                            await fetchData(widget.token, currentService, page);
                          },
                          child: Column(
                            children: [
                              Text(
                                "Dịch vụ",
                                style: TextStyle(
                                  color: currentView == "service" ? Colors.orange : Colors.black,
                                ),
                              ),
                              Container(
                                height: 2.0,
                                width: double.infinity,
                                color: currentView == "service" ? Colors.orange : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  // Payment list display
                  Expanded(
                    child: payment.isEmpty
                        ? Center(child: Text("Không có hóa đơn nào"))
                        : ListView.builder(
                      itemCount: payment.length,
                      itemBuilder: (context, index) {
                        final invoice = payment[index];
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Card(
                              margin: EdgeInsets.all(8.0),
                              child: ListTile(
                                leading: Icon(Icons.receipt),
                                title: Text("Hóa đơn #${invoice['invoiceId']}"),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(formatJoinDate(invoice['issueDate'])),
                                    Text("Tổng tiền: ${invoice['totalAmount']} VNĐ"),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                  // 'Xem thêm' button for pagination
                  if (page < totalPage)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: ElevatedButton(
                        onPressed: () async {
                          setState(() {
                            page++;
                          });
                          await fetchData(widget.token, currentService, page);
                        },
                        child: const Text('Xem thêm'),
                      ),
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
