package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import WebThuePhongTro.WebThuePhongTro.Model.Post;
import WebThuePhongTro.WebThuePhongTro.Model.PostCategory;
import WebThuePhongTro.WebThuePhongTro.Model.PostImages;
import WebThuePhongTro.WebThuePhongTro.Model.RoomType;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostResponse {
    private int postId;
    private String title;
    private double area;
    private String city ;
    private String district;
    private String wards;
    private String address;
    private String description;
    private BigDecimal rentPrice;
    private BigDecimal deposit;
    private LocalDateTime postingDate;
    private LocalDateTime expirationDate;
    private Set<PostImages> postImages;
    private PostCategory postCategory;
    private boolean status;
    private Boolean approvalStatus;
    private String userName;
}

