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
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

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
        if(service== null || service.isEmpty())
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

    public Map<String, Integer> getStatistic(int year) {
        Map<String, Integer> years = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            years.put("Tháng "+i, 0);
        }
        years.putAll(invoiceRepository.findAll().stream()
                .filter(invoice -> invoice.getIssueDate().getYear() == year)
                .collect(Collectors.groupingBy(
                        invoice -> "Tháng "+ invoice.getIssueDate().getMonthValue(),
                        Collectors.summingInt(invoice -> invoice.getTotalAmount().intValue())
                )));
        return years;
    }

    public Map<String, Integer> getStatisticByTime(int month,int year) {
        Map<String, Integer> service = webService.getAllService().stream()
                .collect(Collectors.toMap(
                        Services::getServiceName,
                        invoice -> 0
                ));
        service.putAll(invoiceRepository.findAll().stream()
                .filter(invoice -> invoice.getIssueDate().getYear() == year && invoice.getIssueDate().getMonthValue()==month )
                .collect(Collectors.groupingBy(
                        invoice -> invoice.getService().getServiceName(),
                        Collectors.summingInt(invoice -> invoice.getTotalAmount().intValue())
                )));

        return service;
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
