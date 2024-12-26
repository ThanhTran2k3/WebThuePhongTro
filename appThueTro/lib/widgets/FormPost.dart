import 'dart:io';

import 'package:appthuetro/AuthStorage.dart';
import 'package:appthuetro/api/LocationAPI.dart';
import 'package:appthuetro/api/PostAPI.dart';
import 'package:appthuetro/api/RoomTypeAPI.dart';
import 'package:appthuetro/screens/LoginPage.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:image_picker/image_picker.dart';

class FormPost extends StatefulWidget {
  final Map<String, dynamic>? post;

  FormPost({Key? key, this.post}) : super(key: key);

  @override
  _FormPostState createState() => _FormPostState();
}

class _FormPostState extends State<FormPost> {
  final TextEditingController titleController = TextEditingController();
  final TextEditingController areaController = TextEditingController();
  final TextEditingController rentPriceController = TextEditingController();
  final TextEditingController depositController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  late final AuthStorage _authStorage;
  List<File> _images = [];

  LatLng? center;
  List<Map<String, dynamic>> roomTypes = [];
  String? selectedRoomType;

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
    _authStorage = AuthStorage();
    _getUserLocation();
    loadData();
  }

  void loadData() async{
    await _loadCity();
    await _loadRoomType();
    if (widget.post != null) {
      titleController.text = widget.post!["title"] ?? "";
      areaController.text = widget.post!["area"]?.toString() ?? "";
      rentPriceController.text = widget.post!["rentPrice"]?.toString() ?? "";
      depositController.text = widget.post!["deposit"]?.toString() ?? "";
      addressController.text = widget.post!["address"] ?? "";
      descriptionController.text = widget.post!["description"] ?? "";
      cityName=widget.post!['city'];
      districtName=widget.post!['district'];
      wardName=widget.post!['wards'];
      final citySel = city.where((element) => element['full_name'] == widget.post!['city']).toList();
      if (citySel.isNotEmpty) {
        selectedCity = citySel.first['id'] as String?;
        await _loadDistricts(selectedCity!);
        final districtSel = districts.where((element) => element['full_name'] == widget.post!['district']).toList();
        if(districtSel.isNotEmpty){
          selectedDistrict = districtSel.first['id'] as String?;
          await _loadWards(selectedDistrict!);
          final wardSel = wards.where((element) => element['full_name'] == widget.post!['wards']).toList();
          if(wardSel.isNotEmpty){
            selectedWard = wardSel.first['id'] as String?;
          }
        }
      } else {
        selectedCity = null;
      }
      final roomSTypeSel = roomTypes.where((element) => element['roomTypeId'] == widget.post!['roomType']['roomTypeId']).toList();
      if (roomSTypeSel.isNotEmpty) {
        selectedRoomType = roomSTypeSel.first['roomTypeId'].toString();
      }
      center = LatLng(widget.post!["latitude"], widget.post!["longitude"]);
    }
  }


  void _getUserLocation() async {
    setState(() {
      center = LatLng(10.762622, 106.660172);
    });
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

  Future<void> _loadRoomType() async {
    try {
      final data = await RoomTypeAPI().getRoomType();
      setState(() {
        roomTypes = data.map((e) =>
        {
          'roomTypeId': e['roomTypeId'],
          'typeRoomName': e['typeRoomName']
        }).toList();
      });
    } catch (e) {
      print('Error: $e');
    }
  }

  Future<void> pickImages() async {
    final ImagePicker picker = ImagePicker();

    final List<XFile>? selectedImages = await picker.pickMultiImage();

    if (selectedImages != null) {
      setState(() {
        _images = selectedImages.map((e) => File(e.path)).toList();
      });
    }
  }

  void _handleSubmit(BuildContext context,String token)async {
    final post = {
      'title': titleController.text,
      'area': double.tryParse(areaController.text),
      'rentPrice': double.tryParse(rentPriceController.text),
      'deposit': double.tryParse(depositController.text),
      'description': descriptionController.text,
      'roomType': selectedRoomType,
      'city': cityName,
      'district': districtName,
      'wards': wardName,
      'address': addressController.text,
      'latitude': center?.latitude,
      'longitude': center?.longitude,
      'files': _images,
    };
    if (widget.post == null || widget.post!.isEmpty) {
      await PostAPI().addPost(context, post, token);
    } else {
      final postId = widget.post?['postId'];
      if (postId != null) {
        await PostAPI().editPost(context, postId, post, token);
      }
    }

  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: _authStorage.getAuthData(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError || !snapshot.hasData || snapshot.data == null) {
          return LoginPage();
        }

        final token = snapshot.data!['token'];

        return Scaffold(
          appBar: AppBar(
              title: Text(widget.post == null?"Đăng bài":"Chỉnh sửa"),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: titleController,
                  decoration: InputDecoration(labelText: "Tiêu đề"),
                ),
                SizedBox(height: 16),
                TextField(
                  controller: areaController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: "Diện tích"),
                ),
                SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: rentPriceController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(labelText: "Tiền thuê"),
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: TextField(
                        controller: depositController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(labelText: "Tiền cọc"),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
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
                SizedBox(height: 16),
                TextField(
                  controller: addressController,
                  decoration: InputDecoration(labelText: "Địa chỉ"),
                ),
                SizedBox(height: 16),
                TextField(
                  controller: descriptionController,
                  maxLines: 5,
                  decoration: InputDecoration(labelText: "Mô tả"),
                ),
                SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: selectedRoomType,
                  items: roomTypes.map((item) {
                    return DropdownMenuItem<String>(
                      value: item['roomTypeId'].toString(),
                      child: Text(item['typeRoomName']),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedRoomType = value;
                    });
                  },
                  decoration: InputDecoration(labelText: "Loại phòng"),
                ),
                SizedBox(height: 16),
                TextButton.icon(
                  onPressed: pickImages,
                  icon: Icon(Icons.photo_library),
                  label: Text('Chọn ảnh'),
                ),
                SizedBox(height: 16),
                GridView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                  ),
                  itemBuilder: (context, index) {
                    return Image.file(_images[index]);
                  },
                  itemCount: _images.length,
                ),
                SizedBox(height: 16),
                if (center != null)
                  SizedBox(
                    height: 200,
                    child: GoogleMap(
                      initialCameraPosition: CameraPosition(
                        target: center!,
                        zoom: 15,
                      ),
                      markers: {
                        Marker(
                          markerId: MarkerId("current"),
                          position: center!,
                        )
                      },
                    ),
                  ),
                SizedBox(height: 16),
                Center(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                    ),
                    onPressed: () {
                      _handleSubmit(context,token);
                    },
                    child: Text(
                      widget.post == null ? "Đăng bài" : "Lưu",
                      style: TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  }
}