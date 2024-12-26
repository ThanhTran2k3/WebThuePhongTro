package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.ReviewsRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PageResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ReviewsResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.Reviews;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Service.AuthenticationService;
import WebThuePhongTro.WebThuePhongTro.Service.ReviewsService;
import WebThuePhongTro.WebThuePhongTro.Service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reviews")
public class ReviewsController {

    @Autowired
    private ReviewsService reviewsService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserService userService;

    @GetMapping("/{userName}")
    public ResponseEntity<?> getReviewsUser(@PathVariable String userName,@RequestParam(defaultValue = "1") int page){
        Page<ReviewsResponse> reviewsResponses =reviewsService.getReviewsUser(userName,page);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(reviewsResponses.getTotalPages())
                .content(reviewsResponses.getContent())
                .build();
        return ResponseEntity.ok().body(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(pageResponse)
                .build());
    }


    @PostMapping("/add")
    public ResponseEntity<?> addReviews(@RequestBody ReviewsRequest reviewsRequest, HttpServletRequest request) throws ParseException, JOSEException {
        String userReviews = authenticationService.getUserName(request);
        String reviewsUser = reviewsRequest.getReviewsUser();
        if(userReviews.equals(reviewsUser)){
            throw new AppException(ErrorCode.USER_NOT_REVIEWS);
        }
        reviewsService.add(reviewsRequest,userReviews,reviewsUser);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result("Thành công")
                        .build()
        );
    }

    @PutMapping("/delete/{reviewsId}")
    public ResponseEntity<?> showReviews(@PathVariable int reviewsId, HttpServletRequest request) throws ParseException, JOSEException {
        Reviews reviews = reviewsService.getReviewsById(reviewsId);
        String userName = authenticationService.getUserName(request);
        User user = userService.findByUserName(userName);
        boolean isEmployee = user.getRoles().stream()
                .anyMatch(item -> "ROLE_EMPLOYEE".equals(item.getRoleName()));
        if(!userName.equals(reviews.getReviewer().getUsername())&& !isEmployee){
            throw new AppException(ErrorCode.USER_403);
        }
        return ResponseEntity.ok().body(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(reviewsService.editStatus(reviewsId))
                .build());
    }
}
