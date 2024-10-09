package WebThuePhongTro.WebThuePhongTro.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int invoiceId;

    @Column(nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime issueDate;

    @Column(nullable = false)
    @Min(value = 1, message = "Giá trị phải lớn hơn 0")
    private BigDecimal totalAmount;

    @Column(nullable = false, columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "userId", name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(referencedColumnName = "serviceId", name = "serviceId")
    private Services service;

    @ManyToOne
    @JoinColumn(referencedColumnName = "postId",name = "postId")
    private Post post;
}
