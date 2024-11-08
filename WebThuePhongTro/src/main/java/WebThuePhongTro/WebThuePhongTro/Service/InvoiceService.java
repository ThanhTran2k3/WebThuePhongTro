package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.InvoiceResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Invoice;
import WebThuePhongTro.WebThuePhongTro.Model.Services;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.InvoiceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final UserService userService;

    private final WebService webService;


    public void addInvoice(Invoice invoice){
        invoiceRepository.save(invoice);
    }

    public Page<InvoiceResponse> getInvoiceOfUser(String userName, int page,String service){
        Pageable pageable = PageRequest.of(page-1, 5, Sort.by(Sort.Direction.DESC, "issueDate"));
        if(service== null)
            return invoiceRepository.findByUser_UserName(userName,pageable)
                    .map(InvoiceService::convertToDTO);
        else if (service.equals("Nạp tiền")) {
            return invoiceRepository.findByUser_UserNameAndService_ServiceName(userName,service,pageable)
                    .map(InvoiceService::convertToDTO);
        }
        else
            return invoiceRepository.findByUser_UserNameAndService_ServiceNameNot(userName,"Nạp tiền",pageable)
                    .map(InvoiceService::convertToDTO);
    }


    public Page<InvoiceResponse> getAllInvoice(int page,String service){
        Pageable pageable = PageRequest.of(page-1, 5, Sort.by(Sort.Direction.DESC, "issueDate"));
        if(service== null)
            return invoiceRepository.findAll(pageable)
                    .map(InvoiceService::convertToDTO);
        else if (service.equals("Nạp tiền")) {
            return invoiceRepository.Service_ServiceName(service,pageable)
                    .map(InvoiceService::convertToDTO);
        }
        else
            return invoiceRepository.Service_ServiceNameNot("Nạp tiền",pageable)
                    .map(InvoiceService::convertToDTO);
    }





    public void payment(String userName,String amount,String message){
        User user = userService.findByUserName(userName);
        Services services = webService.getServiceById(1);
        Invoice invoice = Invoice.builder()
                .issueDate(LocalDateTime.now())
                .totalAmount(BigDecimal.valueOf(Long.parseLong(amount)))
                .content(message)
                .service(services)
                .user(user)
                .build();
        invoiceRepository.save(invoice);
        user.setBalance(user.getBalance().add(BigDecimal.valueOf(Long.parseLong(amount))));
        userService.updateUser(user);
    }

    public static InvoiceResponse convertToDTO(Invoice invoice) {

        return InvoiceResponse.builder()
                .invoiceId(invoice.getInvoiceId())
                .issueDate(invoice.getIssueDate())
                .totalAmount(invoice.getTotalAmount())
                .content(invoice.getContent())
                .services(invoice.getService())
                .build();
    }
}
