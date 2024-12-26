package WebThuePhongTro.WebThuePhongTro.Controller;


import WebThuePhongTro.WebThuePhongTro.DTO.Request.AuthenticationRegisterRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Request.UserEditRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.*;
import WebThuePhongTro.WebThuePhongTro.Model.Post;
import WebThuePhongTro.WebThuePhongTro.Model.Role;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Service.*;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserPostService userPostService;

    @Autowired
    private AuthenticationService authenticationService;



    @GetMapping("/detail")
    public ResponseEntity<?> detailUser(HttpServletRequest request) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            var user = userService.findByUserName(userName);
            var result = userService.convertToUserResponse(user);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .time(LocalDateTime.now())
                    .result(result)
                    .build());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.builder()
                        .success(false)
                        .time(LocalDateTime.now())
                        .error("Bạn không có quyền truy cập")
                        .build());
    }

    @PutMapping("/edit/profile")
    public ApiResponse<Object> editUser(@ModelAttribute @Valid UserEditRequest userEditRequest, HttpServletRequest request) throws JOSEException, IOException, ParseException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            User userEdit = userService.editUser(userName,userEditRequest);
            return ApiResponse.builder()
                    .success(true)
                    .time(LocalDateTime.now())
                    .result(authenticationService.update(userEdit))
                    .build();
        }
        return ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .error("Bạn không có quyền truy cập")
                .build();


    }

    @GetMapping("/{userName}")
    public ResponseEntity<?> infoUser(@PathVariable("userName") String userName){
       User user = userService.findByUserName(userName);
       UserResponse userResponse = userService.convertToUserResponse(user);
       return  ResponseEntity.ok(ApiResponse.builder()
               .success(true)
               .time(LocalDateTime.now())
               .result(userResponse)
               .build());
    }

    @GetMapping("/post/{userName}")
    public ResponseEntity<?> postUser(@PathVariable("userName") String userName,
                                      @RequestParam(defaultValue = "1") int page,
                                      @RequestParam(defaultValue = "postDisplays") String postType){
        User user = userService.findByUserName(userName);
        Page<PostResponse> postResponses = userPostService.getPostOfUser(user.getUserId(),page,postType);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(postResponses.getTotalPages())
                .content(postResponses.getContent())
                .build();
        return  ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(pageResponse)
                .build());
    }

    @GetMapping("/role/user")
    public ResponseEntity<?> roleUser(@RequestParam String type,@RequestParam(defaultValue = "1")int page){
        Page<UserResponse> userResponses = userService.getRoleUser(type,page);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(userResponses.getTotalPages())
                .content(userResponses.getContent())
                .build();
        return  ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(pageResponse)
                .build());
    }

    @GetMapping("/role/employee")
    public ResponseEntity<?> roleEmployee(@RequestParam String type,@RequestParam(defaultValue = "1")int page){
        Page<UserResponse> userResponses = userService.getRoleEmployee(type,page);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(userResponses.getTotalPages())
                .content(userResponses.getContent())
                .build();
        return  ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(pageResponse)
                .build());
    }

    @PutMapping("/block/{userName}")
    public void postUser(@PathVariable("userName") String userName){
        userService.blockUser(userName);
    }

    @PostMapping("/add/employee")
    public ResponseEntity<?> createEmployee(
            @RequestBody @Valid AuthenticationRegisterRequest authenticationRegisterRequest) throws IOException {
        User user = User.builder()
                .avatar("/images/AnhMacDinh.jpg")
                .userName(authenticationRegisterRequest.getUserName())
                .phoneNumber(authenticationRegisterRequest.getPhoneNumber())
                .email(authenticationRegisterRequest.getEmail())
                .password(authenticationRegisterRequest.getPassword())
                .build();
        userService.add(user,"ROLE_EMPLOYEE");
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(userService.convertToUserResponse(user))
                .build());
    }

}
