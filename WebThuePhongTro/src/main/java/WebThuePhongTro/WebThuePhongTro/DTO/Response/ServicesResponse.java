package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServicesResponse {

    private int serviceId;

    private String serviceName;

    private BigDecimal price;

    private boolean status;
}
