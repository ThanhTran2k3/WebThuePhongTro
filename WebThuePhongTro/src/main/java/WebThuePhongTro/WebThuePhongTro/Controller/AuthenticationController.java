package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.AuthenticationRegisterRequest;
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
import java.util.Map;

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
        userService.add(user);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(userService.convertToUserResponse(user))
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
