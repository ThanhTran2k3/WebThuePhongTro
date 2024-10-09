package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInfoResponse {
    private UserResponse user;
    private List<PostResponse> listPost;
}
