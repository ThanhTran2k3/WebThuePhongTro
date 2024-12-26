package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.ServiceRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ServicesResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.UserResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.Services;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.ServicesRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class WebService {

    private final ServicesRepository servicesRepository;

    public List<Services> getAllService(){


        return servicesRepository.findAll().stream()
                .filter(s->s.getServiceId()!=1&&s.getServiceId()!=4&&s.isStatus())
                .toList();
    }

    public Page<ServicesResponse> getAllService(int page, boolean status){
        Pageable pageable = PageRequest.of(page-1, 8,Sort.by(Sort.Direction.DESC, "price"));

        return servicesRepository.findActiveServices(status,pageable)
                .map(WebService::convertToServicesResponse);
    }

    public Services getServiceById(int serviceId){
        return servicesRepository.findById(serviceId).orElseThrow(()->new AppException(ErrorCode.SERVICE_NOT_EXIST));
    }

    public void addService(ServiceRequest serviceRequest){
        Services services = Services.builder()
                .serviceName(serviceRequest.getServiceName())
                .price(serviceRequest.getPrice())
                .status(true)
                .build();
        servicesRepository.save(services);
    }

    public void editService(int serviceId,ServiceRequest serviceRequest){
       Services services = getServiceById(serviceId);
       services.setServiceName(serviceRequest.getServiceName());
       services.setPrice(serviceRequest.getPrice());
       servicesRepository.save(services);
    }

    public void editService(Services services){
        servicesRepository.save(services);
    }

    public static ServicesResponse convertToServicesResponse(Services services) {
        return ServicesResponse.builder()
                .serviceId(services.getServiceId())
                .serviceName(services.getServiceName())
                .price(services.getPrice())
                .status(services.isStatus())
                .build();
    }
}
