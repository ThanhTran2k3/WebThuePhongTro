package WebThuePhongTro.WebThuePhongTro.DTO.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceRequest {

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String serviceName;

    @Min(value = 1, message = "Giá trị phải lớn hơn 0")
    private BigDecimal price;
}

