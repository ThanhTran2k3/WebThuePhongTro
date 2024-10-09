package WebThuePhongTro.WebThuePhongTro;

import WebThuePhongTro.WebThuePhongTro.Model.*;
import WebThuePhongTro.WebThuePhongTro.Model.Role;
import WebThuePhongTro.WebThuePhongTro.Repository.*;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Component
@AllArgsConstructor
public class Data implements CommandLineRunner {

    private final RoleRepository roleRepository;

    private final RoomTypeRepository roomTypeRepository;

    private final PostCategoryRepository postCategoryRepository;

    private final UserRepository userRepository;

    private final ServicesRepository servicesRepository;

    @Override
    public void run(String... args) {
        if (roleRepository.count() == 0) {
            List<String> roles = List.of("ROLE_ADMIN", "ROLE_EMPLOYEE", "ROLE_USER");
            for (String roleName : roles) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
            }

            Set<Role> roleSet = new HashSet<>();
            roleSet.add(roleRepository.findById(WebThuePhongTro.WebThuePhongTro.Role.ROLE_ADMIN.value).orElseThrow());
            User user = User.builder()
                    .avatar("/images/AnhMacDinh.jpg")
                    .userName("admin")
                    .phoneNumber("0123456789")
                    .email("admin@gmail.com")
                    .password(new BCryptPasswordEncoder().encode("admin#123@.@."))
                    .status(true)
                    .roles(roleSet)
                    .build();

            userRepository.save(user);
        }
        if(roomTypeRepository.count()==0){
            List<String> roomTypes = List.of("Phòng trọ", "Ktx", "Sleep box");
            for(String roomName : roomTypes){
                RoomType roomType = new RoomType();
                roomType.setTypeRoomName(roomName);
                roomTypeRepository.save(roomType);
            }
        }
        if(postCategoryRepository.count()==0){
            List<String> postCategory = List.of("Tin thường", "Tin nổi bật", "Tin ưu tiên");
            for(String categoryName : postCategory){
                PostCategory postCategory1 = new PostCategory();
                postCategory1.setCategoryName(categoryName);
                postCategoryRepository.save(postCategory1);
            }
        }
        if(servicesRepository.count()==0){
            List<String> services = List.of("Nạp tiền", "Tin nổi bật", "Tin ưu tiên","Gia hạn bài");
            for(String serviceName : services){
                Services service = new Services();
                service.setServiceName(serviceName);
                service.setStatus(true);
                switch (serviceName) {
                    case "Nạp tiền" -> service.setPrice(BigDecimal.valueOf(0));
                    case "Tin ưu tiên" -> service.setPrice(BigDecimal.valueOf(20000));
                    default -> service.setPrice(BigDecimal.valueOf(10000));
                }

                servicesRepository.save(service);
            }
        }

    }
}
