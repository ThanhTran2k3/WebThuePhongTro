package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Services;
import WebThuePhongTro.WebThuePhongTro.Service.WebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/service")
public class ServicesController {

    @Autowired
    private WebService webService;

    @GetMapping("")
    public ResponseEntity<?> getServices(){

        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(webService.getAllService().stream()
                        .filter(s->s.getServiceId()!=1&&s.getServiceId()!=4)
                        .map(WebService::convertToServicesResponse))
                .build());
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<?> getServiceById(@PathVariable("serviceId") int serviceId){
        Services services = webService.getServiceById(serviceId);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(WebService.convertToServicesResponse(services))
                .build());
    }
}
