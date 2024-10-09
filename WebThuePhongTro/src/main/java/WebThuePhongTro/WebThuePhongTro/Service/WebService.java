package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.ServicesResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.UserResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.Services;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.ServicesRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class WebService {

    private final ServicesRepository servicesRepository;

    public List<Services> getAllService(){
        return servicesRepository.findAll();
    }

    public Services getServiceById(int serviceId){
        return servicesRepository.findById(serviceId).orElseThrow(()->new AppException(ErrorCode.SERVICE_NOT_EXIST));
    }

    public static ServicesResponse convertToServicesResponse(Services services) {
        return ServicesResponse.builder()
                .serviceId(services.getServiceId())
                .serviceName(services.getServiceName())
                .price(services.getPrice())
                .build();
    }
}
