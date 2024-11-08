package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import WebThuePhongTro.WebThuePhongTro.Model.Post;
import WebThuePhongTro.WebThuePhongTro.Model.Role;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Builder
@Data
public class AuthenticationResponse {
    private String token;
    private String avatar;
    private String userName;
    private List<String> roles;
    private List<PostResponse> likePost;
}
