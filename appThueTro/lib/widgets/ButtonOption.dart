
import 'package:flutter/material.dart';

class ButtonOption extends StatelessWidget  {
  final IconData icon;
  final String content;


  const ButtonOption(this.icon, this.content);

  @override
  Widget build(BuildContext context) {
     return Material(
       color: Colors.transparent,
       elevation: 0,
       shape: RoundedRectangleBorder(
         borderRadius: BorderRadius.circular(0),
       ),
       child: Container(
         width: MediaQuery.sizeOf(context).width,
         height: 50,
         constraints: const BoxConstraints(
           minWidth: double.infinity,
         ),
         decoration: const BoxDecoration(
           color: Colors.white,
           boxShadow: [
             BoxShadow(
               blurRadius: 0,
               color: Color(0xFFE3E5E7),
               offset: Offset(
                 0.0,
                 2,
               ),
             )
           ],
         ),
         child: Padding(
           padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 4, 0),
           child: Row(
             mainAxisSize: MainAxisSize.max,
             mainAxisAlignment: MainAxisAlignment.spaceBetween,
             children: [
               Icon(
                 icon,
                 size: 24,
               ),
               Expanded(
                 child:
                 Padding(
                   padding: const EdgeInsets.fromLTRB(4.0,0,0,0),
                   child: Text(
                     content
                   ),
                 ),
               ),
             ],
           ),
         ),
       ),
     );
  }
}

