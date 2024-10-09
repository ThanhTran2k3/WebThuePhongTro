package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import WebThuePhongTro.WebThuePhongTro.Model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PostDetailResponse {
    private PostResponse post;
    private UserResponse userCreate;
    private List<PostResponse> posts;
}
