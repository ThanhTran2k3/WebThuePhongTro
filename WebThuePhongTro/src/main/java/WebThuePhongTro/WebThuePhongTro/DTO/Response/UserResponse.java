package WebThuePhongTro.WebThuePhongTro.DTO.Response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private int userId;
    private String avatar;
    private String userName;
    private String fullName;
    private LocalDate birthDate;
    private String phoneNumber;
    private String email;
    private String city ;
    private String district;
    private String wards;
    private String address;
    private BigDecimal balance;
    private LocalDateTime joinDate;
    private boolean status;
}
