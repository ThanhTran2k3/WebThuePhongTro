package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Service.AuthenticationService;
import WebThuePhongTro.WebThuePhongTro.Service.EmailService;
import WebThuePhongTro.WebThuePhongTro.Service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OTPController {
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;


    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, Long> otpExpirationTime = new HashMap<>();

    private static final long OTP_EXPIRATION_TIME = 60 * 1000;
    @PostMapping("/send-email")
    public ResponseEntity<?> sendOtpEmail(@RequestBody Map<String, String> request) throws ParseException, JOSEException {
        String email = request.get("email");
        User user = userService.findByEmail(email);
        String otp = generateOtp();
        emailService.sendOtpEmail("thanhtran8333aaa@gmail.com", otp);

        otpStorage.put(user.getEmail(), otp);
        otpExpirationTime.put(user.getEmail(), System.currentTimeMillis() + OTP_EXPIRATION_TIME);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result("Thành công")
                        .build()
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String otp,@RequestParam String users) throws ParseException, JOSEException {
        User user = userService.findByEmail(users);
        String storedOtp = otpStorage.get(user.getEmail());
        Long expirationTime = otpExpirationTime.get(user.getEmail());
        if (storedOtp == null) {
            throw new AppException(ErrorCode.ERROR_OTP);
        }
        if (System.currentTimeMillis() > expirationTime) {
            otpStorage.remove(user.getEmail());
            otpExpirationTime.remove(user.getEmail());
            throw new AppException(ErrorCode.ERROR_OTP);
        }
        if (storedOtp.equals(otp)) {
            otpStorage.remove(user.getEmail());
            otpExpirationTime.remove(user.getEmail());
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .success(true)
                            .time(LocalDateTime.now())
                            .result("Thành công")
                            .build()
            );
        } else {
            throw new AppException(ErrorCode.ERROR_OTP);
        }
    }

    private String generateOtp() {
        int otp = (int) (Math.random() * 1000000);
        return String.format("%06d", otp);
    }
}
