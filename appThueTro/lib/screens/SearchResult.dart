import 'package:appthuetro/api/LocationAPI.dart';
import 'package:appthuetro/api/PostAPI.dart';
import 'package:appthuetro/api/RoomTypeAPI.dart';
import 'package:appthuetro/widgets/ListPost.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SearchResult extends StatefulWidget {
  final String query;
  const SearchResult({super.key, required this.query});

  @override
  State<SearchResult> createState() => _SearchResultState();
}

class _SearchResultState extends State<SearchResult> {
  late Map<String, dynamic> result;
  late List<dynamic> post = [];
  int page =1;
  int totalPage = 0;
  List<Map<String, dynamic>> roomTypes = [];
  String? roomTypesName;

  List<Map<String, dynamic>> city = [];
  String? cityName;

  List<Map<String, dynamic>> districts = [];
  String? districtName;

  List<Map<String, dynamic>> wards = [];
  String? wardName;

  @override
  void initState() {
    super.initState();
    _loadCity();
    _loadRoomType();
    loadData();
  }

  void loadData() async {
    result = await PostAPI().postSearch(query: widget.query,page: page);
    final data = await result;
    final listPayment = data['content'];
    final total = data['totalPage'];
    setState(() {
        post = listPayment;
        totalPage = total;
    });
  }

  Future<void> fetchData({
    required int page,
    String? city,
    String? district,
    String? ward,
    String? roomType,
  }) async {
    result = await PostAPI().postSearch(query: widget.query,page: page,
        city: city,district: district,ward: ward,roomType: roomType);
    final data = await result;
    final listPayment = data['content'];
    setState(() {
      if(page!=1)
        post.addAll(listPayment);
      else
        post = listPayment;
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
        wards = [];
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Kết quả tìm kiếm"),),
      body: Column(
        children: [
          Wrap(
            spacing: 16,
            runSpacing: 16,
            children: [
              SizedBox(
                width: MediaQuery.of(context).size.width / 2 - 24,
                child: DropdownButtonFormField<String>(
                  items: city.map((item) {
                    return DropdownMenuItem<String>(
                      value: item['id'].toString(),
                      child: Text(item['full_name'],style: TextStyle(fontSize: 12),),
                    );
                  }).toList(),
                  onChanged: (value) async {
                    setState(() {
                      page=1;
                      var selectedCityData = city.firstWhere(
                            (item) => item['id'].toString() == value,
                      );
                      cityName = selectedCityData['full_name'];
                    });
                    _loadDistricts(value!);
                    await fetchData(page: page,city: cityName);
                  },
                  decoration: const InputDecoration(labelText: "Tỉnh/Thành phố"),
                ),
              ),
              SizedBox(
                width: MediaQuery.of(context).size.width / 2 - 24,
                child: DropdownButtonFormField<String>(
                  items: districts.map((item) {
                    return DropdownMenuItem<String>(
                      value: item['id'].toString(),
                      child: Text(item['full_name'],style: TextStyle(fontSize: 12),),
                    );
                  }).toList(),
                  onChanged: (value) async {
                    setState(() {
                      page=1;
                      var selectedDistrictData = districts.firstWhere(
                            (item) => item['id'].toString() == value,
                      );
                      districtName = selectedDistrictData['full_name'];
                    });
                    _loadWards(value!);
                    await fetchData(page: page,city: cityName,district: districtName);
                  },
                  decoration: const InputDecoration(labelText: "Quận/Huyện"),
                ),
              ),
              SizedBox(
                width: MediaQuery.of(context).size.width / 2 - 24,
                child: DropdownButtonFormField<String>(
                  items: wards.map((item) {
                    return DropdownMenuItem<String>(
                      value: item['id'].toString(),
                      child: Text(item['full_name'],style: TextStyle(fontSize: 12),),
                    );
                  }).toList(),
                  onChanged: (value) async {
                    setState(() {
                      page =1;
                      var selectedWardData = wards.firstWhere(
                            (item) => item['id'].toString() == value,
                      );
                      wardName = selectedWardData['full_name'];
                    });
                    await fetchData(page: page,city: cityName,district: districtName,ward: wardName);
                  },
                  decoration: const InputDecoration(labelText: "Phường/Xã"),
                ),
              ),
              SizedBox(
                width: MediaQuery.of(context).size.width / 2 - 24,
                child: DropdownButtonFormField<String>(
                  items: roomTypes.map((item) {
                    return DropdownMenuItem<String>(
                      value: item['roomTypeId'].toString(),
                      child: Text(item['typeRoomName'],style: TextStyle(fontSize: 12),),
                    );
                  }).toList(),
                  onChanged: (value) async {
                    setState(()  {
                      page =1;
                      var selectedRoomTypeData = roomTypes.firstWhere(
                            (item) => item['roomTypeId'].toString() == value,
                      );
                      roomTypesName = selectedRoomTypeData['typeRoomName'];
                    });
                    await fetchData(page: page,city: cityName,district: districtName,ward: wardName,roomType: roomTypesName);
                  },
                  decoration: const InputDecoration(labelText: "Loại phòng"),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16.0),
          Expanded(
              child: ListPost(posts: post)
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
                  await fetchData(page: page);
                },
                child: const Text('Xem thêm'),
              ),
            ),
        ],
      ),
    );
  }
}
