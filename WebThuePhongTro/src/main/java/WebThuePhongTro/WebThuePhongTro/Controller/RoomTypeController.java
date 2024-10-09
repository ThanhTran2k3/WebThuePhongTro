package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.Model.RoomType;
import WebThuePhongTro.WebThuePhongTro.Service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roomType")
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping("")
    public List<RoomType> roomTypeList(){
        return roomTypeService.getAllRoomType();
    }
}
