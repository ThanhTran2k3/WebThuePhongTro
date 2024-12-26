package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.ServiceRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PageResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PostResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ServicesResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Services;
import WebThuePhongTro.WebThuePhongTro.Service.WebService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/service")
public class ServicesController {

    @Autowired
    private WebService webService;

    @GetMapping("")
    public ResponseEntity<?> getUserServices(){
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(webService.getAllService())
                .build());
    }


    @GetMapping("/manager")
    public ResponseEntity<?> getServices(@RequestParam(defaultValue = "1") int page
            ,@RequestParam(defaultValue = "true") boolean status){

        Page<ServicesResponse> postResponses = webService.getAllService(page,status);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(postResponses.getTotalPages())
                .content(postResponses.getContent())
                .build();
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(pageResponse)
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

    @PostMapping("/add")
    public ResponseEntity<?> addService(@Valid @RequestBody ServiceRequest serviceRequest){
        webService.addService(serviceRequest);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/edit/{serviceId}")
    public ResponseEntity<?> editService(@PathVariable int serviceId,@Valid @RequestBody ServiceRequest serviceRequest){
        webService.editService(serviceId,serviceRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/show/{serviceId}")
    public ResponseEntity<?> editStatusService(@PathVariable int serviceId){
        Services services = webService.getServiceById(serviceId);
        boolean status = !services.isStatus();
        services.setStatus(status);
        webService.editService(services);
        return ResponseEntity.ok().build();
    }
}
