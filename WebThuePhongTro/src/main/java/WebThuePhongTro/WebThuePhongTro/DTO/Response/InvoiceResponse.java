package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import WebThuePhongTro.WebThuePhongTro.Model.Services;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InvoiceResponse {

    private int invoiceId;

    private LocalDateTime issueDate;

    private BigDecimal totalAmount;

    private String content;

    private Services services;
}
