package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.InvoiceResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Invoice;
import WebThuePhongTro.WebThuePhongTro.Model.Services;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.InvoiceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final UserService userService;

    private final WebService webService;

    public List<Invoice> getAllInvoice(){
        return invoiceRepository.findAll();
    }

    public void addInvoice(Invoice invoice){
        invoiceRepository.save(invoice);
    }

    public List<InvoiceResponse> getInvoiceOfUser(String userName){
        return invoiceRepository.findAll().stream()
                .filter(s->s.getUser().getUsername().equals(userName)).map(InvoiceService::convertToDTO).toList();
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
