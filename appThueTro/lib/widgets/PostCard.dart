import 'package:appthuetro/screens/PostDetail.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class PostCard extends StatefulWidget {
  final Map<String, dynamic> post;

  PostCard({required this.post});

  @override
  _PostCardState createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  bool isLiked = false;

  String formatRentPrice(double rentPrice) {
    return NumberFormat("#,###").format(rentPrice);
  }

  @override
  Widget build(BuildContext context) {
    String imageUrl = 'http://10.0.2.2:8080${widget.post['postImages'][0]['urlImage']}';

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PostDetail(postId: widget.post['postId']),
          ),
        );
      },
      child: Container(
        width: MediaQuery.of(context).size.width - 50,
        height: MediaQuery.of(context).size.height / 2,
        margin: const EdgeInsets.symmetric(vertical: 4.0, horizontal: 12.0),
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8.0),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 2,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width:  MediaQuery.of(context).size.width / 2 ,
              height: 100.0,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8.0),
                image: DecorationImage(
                  image: NetworkImage(imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 12.0),
            Text(
              widget.post['title'],
              style: const TextStyle(
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            Row(
              children: [
                Text(
                  '${widget.post['area']} m\u00B2',
                  style: TextStyle(
                      fontSize: 14.0,
                      color: Colors.grey[600],
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 50.0),
                IconButton(
                  icon: Icon(
                    isLiked ? Icons.favorite : Icons.favorite_border,
                    color: Colors.red,
                    size: 24.0,
                  ),
                  onPressed: () {
                    setState(() {
                      isLiked = !isLiked;
                    });
                  },
                ),
              ],
            ),
            // Giá tiền thuê
            Text(
              '${formatRentPrice(widget.post['rentPrice'])} đ/tháng',
              style: TextStyle(
                color: Colors.red,
                fontSize: 14.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6.0),
            // Thành phố
            Text(
              '${widget.post['city']}',
              style: TextStyle(
                color: Colors.black87,
                fontSize: 12.0,
              ),
            ),
            const SizedBox(height: 6.0),
            Row(
              children: [
                Icon(
                  Icons.account_circle,
                  color: Colors.grey[600],
                  size: 14.0,
                ),
                const SizedBox(width: 4.0),
                Text(
                  widget.post['userName'],
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14.0,
                  ),
                ),
                const SizedBox(width: 2.0),
                if (widget.post['postCategory']['postCategoryId'] == 3) ...[
                  Text(
                    '|',
                    style: TextStyle(
                      color: Colors.black87,
                      fontSize: 14.0,
                    ),
                  ),
                  const SizedBox(width: 2.0),
                  Icon(
                    Icons.arrow_upward,
                    color: Colors.grey[600],
                    size: 14.0,
                  ),
                  const SizedBox(width: 4.0),
                  Text(
                    'Tin ưu tiên',
                    style: TextStyle(
                      color: Colors.black87,
                      fontSize: 14.0,
                    ),
                  ),
                ]
              ],
            ),
          ],
        ),
      ),
    );
  }
}
