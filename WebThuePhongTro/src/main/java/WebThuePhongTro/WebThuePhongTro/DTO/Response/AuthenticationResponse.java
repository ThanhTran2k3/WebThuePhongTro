package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import WebThuePhongTro.WebThuePhongTro.Model.Post;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class AuthenticationResponse {
    private String token;
    private String avatar;
    private String userName;
    private List<PostResponse> likePost;
}
