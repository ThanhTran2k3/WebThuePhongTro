package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.ReviewsRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ReviewsResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.UserResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.Reviews;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.ReviewsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewsService {

    private final ReviewsRepository reviewsRepository;
    private final UserService userService;

    public void add(ReviewsRequest reviewsRequest, String userReviewsName, String reviewsUserName){
        User userReviews = userService.findByUserName(userReviewsName);
        User reviewsUser = userService.findByUserName(reviewsUserName);
        Reviews reviews = Reviews.builder()
                .content(reviewsRequest.getContent())
                .reviewer(userReviews)
                .reviewedUser(reviewsUser)
                .status(true)
                .time(LocalDateTime.now())
                .build();
        reviewsRepository.save(reviews);
    }

    public ReviewsResponse editStatus(int reviewsId){
        Reviews reviews = getReviewsById(reviewsId);
        boolean status = reviews.isStatus();
        reviews.setStatus(!status);
        return convertToCommentResponse(reviews);
    }

    public Page<ReviewsResponse> getReviewsUser(String userName, int page){
        Pageable pageable = PageRequest.of(page-1, 5, Sort.by(Sort.Direction.DESC, "time"));
        return reviewsRepository.getReviewsUser(userName,pageable)
                .map(this::convertToCommentResponse);
    }

    public Reviews getReviewsById(int reviewsId){
        return reviewsRepository.findById(reviewsId).orElseThrow(()-> new AppException(ErrorCode.REVIEWS_NOT_EXIST));
    }

    public ReviewsResponse convertToCommentResponse(Reviews reviews){
        UserResponse userResponse = userService.convertToUserResponse(reviews.getReviewer());
        return ReviewsResponse.builder()
                .reviewsId(reviews.getReviewsId())
                .userReviews(userResponse)
                .content(reviews.getContent())
                .time(reviews.getTime())
                .build();
    }

}
