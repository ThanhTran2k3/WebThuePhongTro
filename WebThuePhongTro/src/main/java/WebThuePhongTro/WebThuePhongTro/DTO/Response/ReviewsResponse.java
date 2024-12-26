package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class ReviewsResponse {

    private int reviewsId;
    private UserResponse userReviews;
    private String content;
    private LocalDateTime time;
}
