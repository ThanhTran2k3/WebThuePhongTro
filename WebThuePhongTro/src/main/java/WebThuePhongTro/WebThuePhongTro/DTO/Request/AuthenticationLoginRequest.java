package WebThuePhongTro.WebThuePhongTro.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthenticationLoginRequest {

    private String userName;
    private String password;
}
