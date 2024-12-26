import 'dart:io';

import 'package:appthuetro/api/LocationAPI.dart';
import 'package:appthuetro/api/UserAPI.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

class EditUser extends StatefulWidget {
  final String token;
  final Map<String,dynamic> userInfo;
  const EditUser({required this.token,required this.userInfo, Key? key}) : super(key: key);

  @override
  _EditUserState createState() => _EditUserState();
}


class _EditUserState extends State<EditUser> {
  final TextEditingController userNameController = TextEditingController();
  final TextEditingController fullNameController = TextEditingController();
  final TextEditingController phoneNumberController = TextEditingController();
  final TextEditingController birthController = TextEditingController();
  final TextEditingController birthDisPlayController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  String imageUrl="";
  File? _avatar;
  final ImagePicker _picker = ImagePicker();

  List<Map<String, dynamic>> city = [];
  String? selectedCity;
  String? cityName;

  List<Map<String, dynamic>> districts = [];
  String? selectedDistrict;
  String? districtName;

  List<Map<String, dynamic>> wards = [];
  String? selectedWard;
  String? wardName;


  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  Future<void> _initializeData() async {
    await _loadCity();
    _loadAuthData();
  }

  Future<void> _loadAuthData() async {
    if(widget.token.isEmpty){
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => LoginPage()),
      );
    }
    else{
      userNameController.text = widget.userInfo['userName'] ?? '';
      fullNameController.text = widget.userInfo['fullName'] ?? '';
      phoneNumberController.text = widget.userInfo['phoneNumber'] ?? '';
      final birthDate = widget.userInfo['birthDate'] != null ? DateTime.parse(widget.userInfo['birthDate']) : null;
      birthController.text = birthDate != null ? DateFormat('dd-MM-yyyy').format(birthDate) : '';
      emailController.text = widget.userInfo['email'] ?? '';
      addressController.text = widget.userInfo['address'] ?? '';
      imageUrl = 'http://10.0.2.2:8080${widget.userInfo['avatar']}';
      final citySel = city.where((element) => element['full_name'] == widget.userInfo['city']).toList();
      if (citySel.isNotEmpty) {
        selectedCity = citySel.first['id'] as String?;
        await _loadDistricts(selectedCity!);
        final districtSel = districts.where((element) => element['full_name'] == widget.userInfo['district']).toList();
        if(districtSel.isNotEmpty){
          selectedDistrict = districtSel.first['id'] as String?;
          await _loadWards(selectedDistrict!);
          final wardSel = wards.where((element) => element['full_name'] == widget.userInfo['wards']).toList();
          if(wardSel.isNotEmpty){
            selectedWard = wardSel.first['id'] as String?;
          }
        }
      } else {
        selectedCity = null;
      }

    }
  }


  Future<void> _pickImage() async {
    final XFile? pickedFile = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 300,
      maxHeight: 300,
    );

    if (pickedFile != null) {
      setState(() {
        _avatar = File(pickedFile.path);
      });
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
    );
    if (pickedDate != null) {
      setState(() {
        birthDisPlayController.text = "${pickedDate.day.toString().padLeft(2, '0')}/${pickedDate.month.toString().padLeft(2, '0')}/${pickedDate.year}";
        birthController.text = "${pickedDate.year}-${pickedDate.month.toString().padLeft(2, '0')}-${pickedDate.day.toString().padLeft(2, '0')}";
      });
    }
  }

  Future<void> _loadCity() async {
    try {
      final data = await LocationAPI().getCity();
      setState(() {
        city = data.map((e) => {'id': e['id'], 'full_name': e['full_name']})
            .toList();
      });
    } catch (e) {
      print('Error loading provinces: $e');
    }
  }

  Future<void> _loadDistricts(String cityId) async {
    try {
      final data = await LocationAPI().getDistricts(cityId);
      setState(() {
        districts =
            data.map((e) => {'id': e['id'], 'full_name': e['full_name']})
                .toList();
        selectedDistrict = null;
        wards = [];
        selectedWard = null;
      });
    } catch (e) {
      print('Error: $e');
    }
  }

  Future<void> _loadWards(String district) async {
    try {
      final data = await LocationAPI().getWard(district);
      setState(() {
        wards = data.map((e) => {'id': e['id'], 'full_name': e['full_name']})
            .toList();
        selectedWard = null;
      });
    } catch (e) {
      print('Error: $e');
    }
  }

  void _handleSubmit(String token) {
    DateTime birthDate = DateTime.parse(birthController.text);
    String formattedDate = DateFormat('yyyy-MM-dd').format(birthDate);
    final user = {
      'userName': userNameController.text,
      'fullName': fullNameController.text,
      'phoneNumber': phoneNumberController.text,
      'birthDate':   formattedDate,
      'email': emailController.text,
      'city': cityName,
      'district': districtName,
      'wards': wardName,
      'address': addressController.text,
      if(_avatar!=null)'avatar': _avatar,
    };

    UserAPI().editUser(context,user, token);
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Thông tin cá nhân"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [

          CircleAvatar(
          radius: 60,
          backgroundImage: _avatar != null ? FileImage(_avatar!) :
          imageUrl.isNotEmpty? NetworkImage(imageUrl):null,
          child: _avatar == null && widget.userInfo['avatar'] == null
              ? const Icon(Icons.person, size: 60)
              : null,
        ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _pickImage,
              child: const Text("Chọn ảnh"),
            ),
            const SizedBox(height: 16.0),

            // User Name
            TextField(
              controller: userNameController,
              decoration: InputDecoration(
                  labelText: "Tên người dùng"
              ),
            ),
            const SizedBox(height: 16.0),

            // Full Name
            TextField(
              controller: fullNameController,
              decoration: const InputDecoration(
                labelText: "Họ và tên",
              ),
            ),
            const SizedBox(height: 16.0),

            TextField(
              controller: birthDisPlayController,
              decoration: InputDecoration(
                labelText: 'Ngày sinh',
                hintText: 'DD/MM/YYYY',
                suffixIcon: Icon(Icons.calendar_today),
              ),
              readOnly: true,
              onTap: () {
                _selectDate(context); // Mở DatePicker
              },
            ),

            const SizedBox(height: 16.0),
            TextField(
              controller: phoneNumberController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: "Số điện thoại",
              ),
            ),
            const SizedBox(height: 16.0),

            // Email
            TextField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: "Email",
              ),
            ),
            const SizedBox(height: 16.0),


            DropdownButtonFormField<String>(
              value: selectedCity,
              items: city.map((item) {
                return DropdownMenuItem<String>(
                  value: item['id'].toString(),
                  child: Text(item['full_name']),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  selectedCity = value;
                  var selectedCityData = city.firstWhere(
                        (item) => item['id'].toString() == value,
                  );
                  cityName = selectedCityData['full_name'];
                  _loadDistricts(value!);
                });
              },
              decoration: InputDecoration(labelText: "Tỉnh/Thành phố"),
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: selectedDistrict,
              items: districts.map((item) {
                return DropdownMenuItem<String>(
                  value: item['id'].toString(),
                  child: Text(item['full_name']),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  selectedDistrict = value;
                  var selectedDistrictData = districts.firstWhere(
                        (item) => item['id'].toString() == value,
                  );
                  districtName = selectedDistrictData['full_name'];
                  _loadWards(value!);
                });
              },
              decoration: InputDecoration(labelText: "Quận/Huyện"),
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: selectedWard,
              items: wards.map((item) {
                return DropdownMenuItem<String>(
                  value: item['id'].toString(),
                  child: Text(item['full_name']),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  selectedWard = value;
                  var selectedWardData = wards.firstWhere(
                        (item) => item['id'].toString() == value,
                  );
                  wardName = selectedWardData['full_name'];
                });
              },
              decoration: InputDecoration(labelText: "Phường/Xã"),
            ),
            const SizedBox(height: 16.0),
            TextField(
              controller: addressController,
              decoration: const InputDecoration(
                labelText: "Địa chỉ",
              ),
            ),
            const SizedBox(height: 16.0),

            ElevatedButton(
              onPressed: (){
                _handleSubmit(widget.token);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.indigo,
                minimumSize: Size(double.infinity, 50),
              ),
              child: Text(
                'Lưu thay đổi',
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
            ),

          ],
        ),
      ),
    );
  }

}
