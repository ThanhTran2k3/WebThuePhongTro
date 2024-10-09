package WebThuePhongTro.WebThuePhongTro.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Entity
@Table(name = "Services")
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int serviceId;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String serviceName;

    @Column(nullable = false)
    @Min(value = 1,message = "Giá trị phải lớn hơn 0")
    private BigDecimal price;

    @Column(nullable = false)
    private boolean status;

    @OneToMany(mappedBy = "service")
    private Set<Invoice> invoices;
}
