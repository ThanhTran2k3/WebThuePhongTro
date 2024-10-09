package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Invoice;
import WebThuePhongTro.WebThuePhongTro.Model.Services;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Service.*;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.text.NumberFormat;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private MoMoPaymentService moMoPaymentService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private AuthenticationService authenticationService;

    private String userName;
    @PostMapping("/momo")
    public ResponseEntity<?> createMoMoPayment(@RequestParam Long amount, HttpServletRequest request) throws ParseException, JOSEException {
        String user = authenticationService.getUserName(request);
        if(!user.isEmpty()){
            userName = user;
            NumberFormat numberFormat = NumberFormat.getInstance(Locale.forLanguageTag("vi-VN"));
            String formattedAmount = numberFormat.format(amount);

            String orderId = UUID.randomUUID().toString();
            String requestId = UUID.randomUUID().toString();
            String orderInfo = "Nạp " + formattedAmount + "đ vào tài khoản";
            String returnUrl = "http://localhost:8080/api/payment/confirmPaymentMomo";
            String notifyUrl = "ok";

            String paymentUrl = moMoPaymentService.createPaymentRequest(orderId, requestId, amount, orderInfo, returnUrl, notifyUrl);

            if (paymentUrl != null) {
                return ResponseEntity.ok(paymentUrl);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApiResponse.builder()
                                .success(false)
                                .time(LocalDateTime.now())
                                .error("Lỗi tạo thanh toán")
                                .build());
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.builder()
                        .success(false)
                        .time(LocalDateTime.now())
                        .error("Bạn không có quyền truy cập")
                        .build());
    }

    @GetMapping("/confirmPaymentMomo")
    public ResponseEntity<String> confirmPayment(@RequestParam Map<String, String> params) {
        String orderId = params.get("orderId");
        String requestId = params.get("requestId");
        String amount = params.get("amount");
        String message = params.get("message");
        String resultCode = params.get("errorCode");


        HttpHeaders headers = new HttpHeaders();
        if (resultCode.equals("0")) {
            invoiceService.payment(userName,amount,message);
            String redirectUrl = "http://localhost:3000/user/manager/payment";
            headers.setLocation(URI.create(redirectUrl));
        } else {
            String errorRedirectUrl = "http://localhost:3000/user/manager/payment?status=fail";
            headers.setLocation(URI.create(errorRedirectUrl));
        }
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}
