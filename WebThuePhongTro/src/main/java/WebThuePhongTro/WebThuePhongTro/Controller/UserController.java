package WebThuePhongTro.WebThuePhongTro.Controller;


import WebThuePhongTro.WebThuePhongTro.DTO.Request.UserEditRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.AuthenticationResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.UserInfoResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Post;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Service.AuthenticationService;
import WebThuePhongTro.WebThuePhongTro.Service.PostService;
import WebThuePhongTro.WebThuePhongTro.Service.UserPostService;
import WebThuePhongTro.WebThuePhongTro.Service.UserService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.List;

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
       List<Post> posts = userPostService.getPostCreateByUser(user.getUserId());
       UserInfoResponse userInfoResponse = UserInfoResponse.builder()
                .user(userService.convertToUserResponse(user))
                .listPost(posts.stream().map(PostService::convertToDTO).toList())
                .build();

       return  ResponseEntity.ok(ApiResponse.builder()
               .success(true)
               .time(LocalDateTime.now())
               .result(userInfoResponse)
               .build());
    }

}
