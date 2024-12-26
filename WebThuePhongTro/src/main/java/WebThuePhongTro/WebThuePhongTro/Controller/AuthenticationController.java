package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.AuthenticationRegisterRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Request.PasswordRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Request.AuthenticationLoginRequest;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Service.AuthenticationService;
import WebThuePhongTro.WebThuePhongTro.Service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserService userService;

    @PostMapping("/log-in")
    public ResponseEntity<?> login(@RequestBody AuthenticationLoginRequest request) throws JOSEException {
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(authenticationService.login(request))
                .build());
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody @Valid AuthenticationRegisterRequest authenticationRegisterRequest) throws IOException {
        User user = User.builder()
                .avatar("/images/AnhMacDinh.jpg")
                .userName(authenticationRegisterRequest.getUserName())
                .phoneNumber(authenticationRegisterRequest.getPhoneNumber())
                .email(authenticationRegisterRequest.getEmail())
                .password(authenticationRegisterRequest.getPassword())
                .build();
        userService.add(user,"ROLE_USER");
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(userService.convertToUserResponse(user))
                .build());
    }

    @PutMapping("/changePass")
    public ResponseEntity<?> changePass(
            @RequestBody @Valid PasswordRequest passwordRequest, HttpServletRequest request) throws ParseException, JOSEException {
        authenticationService.changePass(passwordRequest,request);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result("Thành công")
                .build());
    }

    @PostMapping("/changePassOTP")
    public ResponseEntity<?> changePassOTP(
            @RequestBody @Valid PasswordRequest passwordRequest) throws ParseException, JOSEException {
        authenticationService.changePassOTP(passwordRequest,passwordRequest.getEmail());
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result("Thành công")
                .build());
    }

    @GetMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) throws JOSEException, ParseException {
        String authorizationHeader = request.getHeader("Authorization");
        String token = authorizationHeader.substring(7);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(authenticationService.refreshToken(token))
                .build());
    }
}
