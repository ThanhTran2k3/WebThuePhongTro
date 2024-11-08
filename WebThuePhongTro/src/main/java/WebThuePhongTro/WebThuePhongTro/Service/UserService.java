package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.UserEditRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.UserResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.RoleRepository;
import WebThuePhongTro.WebThuePhongTro.Repository.UserPostRepository;
import WebThuePhongTro.WebThuePhongTro.Repository.UserRepository;
import WebThuePhongTro.WebThuePhongTro.Role;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final UserPostRepository userPostRepository;

    public List<User> getAllUser(){
        return userRepository.findAll();
    }

    public User findByUserName(String userName){
        return userRepository.findByUserName(userName).orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXIST));
    }


    public void add(User user) throws IOException {

        user.setBalance(BigDecimal.valueOf(0));
        user.setStatus(true);
        user.setJoinDate(LocalDateTime.now());
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        Set<WebThuePhongTro.WebThuePhongTro.Model.Role> roles = new HashSet<>();
        roles.add(roleRepository.findById(Role.ROLE_USER.value).orElseThrow());
        user.setRoles(roles);
        userRepository.save(user);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public User editUser(String userName, UserEditRequest userEditRequest) throws IOException {
        User user = userRepository.findByUserName(userName).orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXIST));

        if(userEditRequest.getAvatar() != null) {
            user.setAvatar(saveImage(userEditRequest.getAvatar()));
        }

        user.setUserName(userEditRequest.getUserName());
        user.setFullName(userEditRequest.getFullName());
        user.setBirthDate(userEditRequest.getBirthDate());
        user.setPhoneNumber(userEditRequest.getPhoneNumber());
        user.setEmail(userEditRequest.getEmail());
        user.setCity(userEditRequest.getCity());
        user.setDistrict(userEditRequest.getDistrict());
        user.setWards(userEditRequest.getWards());
        user.setAddress(userEditRequest.getAddress());


        updateUser(user);
        return user;
    }


    public String saveImage(MultipartFile image) throws IOException {
        File staticImagesFolder = new File("target/classes/static/images");
        File imagesFolder = new File("src/main/resources/static/images");

        if (!staticImagesFolder.exists()) {
            staticImagesFolder.mkdirs();
        }
        String fileName =Math.random() + image.getOriginalFilename();
        Path path = Paths.get(staticImagesFolder.getAbsolutePath() + File.separator + fileName);
        Path pathCopy = Paths.get(imagesFolder.getAbsolutePath() + File.separator + fileName);
        Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        Files.copy(image.getInputStream(), pathCopy, StandardCopyOption.REPLACE_EXISTING);
        return "/images/" + fileName;
    }

    public UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .avatar(user.getAvatar())
                .userName(user.getUsername())
                .fullName(user.getFullName())
                .birthDate(user.getBirthDate())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .city(user.getCity())
                .district(user.getDistrict())
                .wards(user.getWards())
                .address(user.getAddress())
                .balance(user.getBalance())
                .joinDate(user.getJoinDate())
                .status(user.isStatus())
                .build();
    }

    public Page<UserResponse> getRoleUser(String type, int page){
        Pageable pageable = PageRequest.of(page-1, 3, Sort.by(Sort.Direction.DESC, "joinDate"));
        if(type.equals("active"))
            return userRepository.findByStatusAndRoles_RoleName(true,"ROLE_USER",pageable)
                    .map(this::convertToUserResponse);
        else
            return userRepository.findByStatusAndRoles_RoleName(false,"ROLE_USER",pageable)
                    .map(this::convertToUserResponse);
    }


    public void blockUser(String userName){
        User user = userRepository.findByUserName(userName).orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXIST));
        user.setStatus(!user.isStatus());
        userRepository.save(user);
    }

}
