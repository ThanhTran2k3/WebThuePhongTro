package WebThuePhongTro.WebThuePhongTro.Service;


import WebThuePhongTro.WebThuePhongTro.Model.RoomType;
import WebThuePhongTro.WebThuePhongTro.Repository.RoomTypeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public List<RoomType> getAllRoomType(){
        return roomTypeRepository.findAll();
    }
}
