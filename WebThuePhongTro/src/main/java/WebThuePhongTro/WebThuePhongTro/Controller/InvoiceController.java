package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.InvoiceResponse;
import WebThuePhongTro.WebThuePhongTro.Service.AuthenticationService;
import WebThuePhongTro.WebThuePhongTro.Service.InvoiceService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Comparator;


@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private AuthenticationService authenticationService;

    @GetMapping("/history")
    public ResponseEntity<?> getInvoiceOfUser(HttpServletRequest request) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            var result = invoiceService.getInvoiceOfUser(userName)
                    .stream().sorted((Comparator.comparing(InvoiceResponse::getIssueDate).reversed()));
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .success(true)
                            .time(LocalDateTime.now())
                            .result(result)
                            .build()
            );
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.builder()
                        .success(false)
                        .time(LocalDateTime.now())
                        .error("Bạn không có quyền truy cập")
                        .build()
        );
    }
}
