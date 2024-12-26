import 'package:appthuetro/api/PostAPI.dart';
import 'package:appthuetro/screens/SearchResult.dart';
import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  List<dynamic> filteredItems = [];
  @override
  void initState() {
    super.initState();
    loadDate();
  }

  void  loadDate() async {
    final data = await PostAPI().postSuggestions("");
    setState(() {
      filteredItems= data;
    });
  }

  void _filterItems(String query) async {
    final data;
    if (query.isEmpty) {
      data = await PostAPI().postSuggestions("");
    } else {
      data = await PostAPI().postSuggestions(query);
    }
    setState(() {
      filteredItems= data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _searchController,
              onChanged: _filterItems,
              decoration: InputDecoration(
                labelText: 'Nhập từ khóa tìm kiếm',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.search),
              ),
              onSubmitted: (value) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => SearchResult(query: value)),
                );
              },
            ),
            const SizedBox(height: 20),
            Expanded(
              child: filteredItems.isNotEmpty
                  ? ListView.builder(
                itemCount: filteredItems.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(
                      filteredItems[index],
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      style: TextStyle(
                        fontSize: 16,
                      ),
                    ),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => SearchResult(query: filteredItems[index])),
                      );
                    },
                  );
                },
              )
                  : Center(
                child: Text(
                  'Không có kết quả phù hợp.',
                  style: TextStyle(fontSize: 16, color: Colors.grey),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
