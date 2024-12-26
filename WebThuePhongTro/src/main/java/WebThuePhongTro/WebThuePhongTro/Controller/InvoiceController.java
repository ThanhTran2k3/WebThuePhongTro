package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.InvoiceResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PageResponse;
import WebThuePhongTro.WebThuePhongTro.Service.AuthenticationService;
import WebThuePhongTro.WebThuePhongTro.Service.InvoiceService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<?> getInvoiceOfUser(HttpServletRequest request,
                                              @RequestParam(defaultValue = "1") int page
                                              ,@RequestParam(required = false) String service) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            Page<InvoiceResponse> invoiceResponses = invoiceService.getInvoiceOfUser(userName,page,service);
            PageResponse<?> pageResponse = PageResponse.builder()
                    .currentPage(page)
                    .totalPage(invoiceResponses.getTotalPages())
                    .content(invoiceResponses.getContent())
                    .build();
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .success(true)
                            .time(LocalDateTime.now())
                            .result(pageResponse)
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

    @GetMapping("")
    public ResponseEntity<?> getAllInvoice(HttpServletRequest request,
                                              @RequestParam(defaultValue = "1") int page
            ,@RequestParam(required = false) String service) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            Page<InvoiceResponse> invoiceResponses = invoiceService.getAllInvoice(page,service);
            PageResponse<?> pageResponse = PageResponse.builder()
                    .currentPage(page)
                    .totalPage(invoiceResponses.getTotalPages())
                    .content(invoiceResponses.getContent())
                    .build();
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .success(true)
                            .time(LocalDateTime.now())
                            .result(pageResponse)
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

    @GetMapping("/statistic")
    public ResponseEntity<?> getChart(@RequestParam int year) throws ParseException, JOSEException {

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(invoiceService.getStatistic(year))
                        .build()
        );
    }

    @GetMapping("/statistic/time")
    public ResponseEntity<?> getChartTime(@RequestParam int year,@RequestParam int month) throws ParseException, JOSEException {

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(invoiceService.getStatisticByTime(month,year))
                        .build()
        );
    }
}
