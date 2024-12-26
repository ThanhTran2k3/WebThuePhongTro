package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.PostRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PageResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PostDetailResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PostResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.*;
import WebThuePhongTro.WebThuePhongTro.Service.*;
import WebThuePhongTro.WebThuePhongTro.Validator.CreateGroup;
import WebThuePhongTro.WebThuePhongTro.Validator.EditGroup;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.aspectj.weaver.ast.Literal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.Normalizer;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserPostService userPostService;

    @Autowired
    private AuthenticationService authenticationService;

    @GetMapping("")
    public ResponseEntity<?> getAllPost(@RequestParam(defaultValue = "1") int page,
                                          @RequestParam(required = false) String city,
                                          @RequestParam(required = false) String district,
                                          @RequestParam(required = false) String ward,
                                          @RequestParam(required = false) String roomType) {
        Page<PostResponse> postResponses = postService.getAllPost(page,city,district,ward,roomType);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(postResponses.getTotalPages())
                .content(postResponses.getContent())
                .build();
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(pageResponse)
                .build());
    }

    @GetMapping("/region")
    public ResponseEntity<?> getRegion(@RequestParam(required = false) String query,
                                        @RequestParam(required = false) String city,
                                        @RequestParam(required = false) String district,
                                        @RequestParam(required = false) String ward,
                                        @RequestParam(required = false) String roomType) {
        List<PostResponse> postResponses = postService.getRegion(query,city,district,ward,roomType);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(postResponses)
                .build());
    }

    @GetMapping("/location")
    public ResponseEntity<?> getLocationPost(@RequestParam String address,
                                       @RequestParam(required = false) String city,
                                       @RequestParam(required = false) String district,
                                       @RequestParam(required = false) String ward,
                                       @RequestParam(required = false) String roomType) {
        List<PostResponse> postResponses = postService.getNearPost(address,city,district,ward,roomType);
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(postResponses)
                .build());
    }

    @GetMapping("/new")
    public ResponseEntity<?> getNewPost() {
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(postService.getNewPost())
                .build());
    }

    @GetMapping("/near")
    public ResponseEntity<?> getNearPost(@RequestParam String address) {
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(postService.getNearPost(address))
                .build());
    }

    @GetMapping("/near/post")
    public ResponseEntity<?> getNearPost(@RequestParam String address,
                                         @RequestParam(defaultValue = "1") int page,
                                         @RequestParam(required = false) String city,
                                         @RequestParam(required = false) String district,
                                         @RequestParam(required = false) String ward,
                                         @RequestParam(required = false) String roomType) {
        Page<PostResponse> postResponses = postService.getNearPost(address,page,city,district,ward,roomType);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(postResponses.getTotalPages())
                .content(postResponses.getContent())
                .build();
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(pageResponse)
                .build());
    }

    @GetMapping("/city")
    public ResponseEntity<?> getPostCity(@RequestParam String city) {
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(postService.getPostLocation(city))
                .build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> createPost(@ModelAttribute @Validated(CreateGroup.class) PostRequest postRequest, HttpServletRequest request) throws IOException, ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            User user = userService.findByUserName(userName);
            postService.addPost(user,postRequest);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable int postId,HttpServletRequest request) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            Post post = postService.getPostId(postId);
            if(postService.checkPostOfUser(userName,postId)) {
                return ResponseEntity.ok(ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(PostService.convertToDTO(post,userName))
                        .build());
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .success(false)
                .time(LocalDateTime.now())
                .error(ErrorCode.USER_403.getMessage())
                .build());
    }

    @PutMapping("/status/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable int postId,@RequestParam(defaultValue = "delete") String action) {
        postService.updateStatusPostById(postId,action);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result("Thành công")
                .build());
    }



    @PutMapping("/edit/{postId}")
    public ResponseEntity<?> editPost(@PathVariable int postId, @ModelAttribute @Validated(EditGroup.class) PostRequest postRequest, HttpServletRequest request) throws IOException, ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(postService.checkPostOfUser(userName,postId)) {
            postService.editPost(postId,postRequest);
            return ResponseEntity.ok().body(ApiResponse.builder()
                    .success(true)
                    .time(LocalDateTime.now())
                    .result("Thành công")
                    .build());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .success(false)
                .time(LocalDateTime.now())
                .error(ErrorCode.USER_403.getMessage())
                .build());
    }

    @PutMapping("/show/{postId}")
    public ResponseEntity<?> showPost(@PathVariable("postId") int postId, HttpServletRequest request) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        Post post = postService.getPostId(postId);
        if(postService.checkPostOfUser(userName,post.getPostId())){
            boolean status = !post.isStatus();
            post.setStatus(status);
            postService.updatePost(post);
            List<PostResponse> postResponses = postService.getAllPost().stream()
                    .map(item -> PostService.convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                    .toList();
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .time(LocalDateTime.now())
                    .result(postResponses)
                    .build());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .success(false)
                .time(LocalDateTime.now())
                .error(ErrorCode.USER_403.getMessage())
                .build());
    }

    @GetMapping("/detail/{postId}")
    public ApiResponse<Object> detailPost(@PathVariable int postId) {
        Post post = postService.getPostId(postId);
        User user = userPostService.getUserCreatePost(post.getPostId());
        List<PostResponse> postNear = postService.getNearPost(post);
        PostDetailResponse postDetailResponse = PostDetailResponse.builder()
                .post(PostService.convertToDTO(post,user.getUsername()))
                .userCreate(userService.convertToUserResponse(user))
                .postNear(postNear)
                .build();

        return ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(postDetailResponse)
                .build();
    }

    @PostMapping("/like/{postId}")
    public ResponseEntity<?> likePost(@PathVariable int postId, HttpServletRequest request) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            postService.likePost(userName,postId);
            User user = userService.findByUserName(userName);
            return ResponseEntity.ok(ApiResponse.builder()
                    .success(true)
                    .time(LocalDateTime.now())
                    .result(userPostService.getLikePostOfUser(user.getUserId()).stream()
                            .map(item->PostService.convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername())))
                    .build());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .error(ErrorCode.USER_403.getMessage())
                .build());

    }

    @PostMapping("/extend/{postId}")
    public ResponseEntity<?> extendPost(@PathVariable("postId") int postId, @RequestBody Map<String, Integer> requestBody, HttpServletRequest request ) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            if(postService.checkPostOfUser(userName,postId)) {
                int month = requestBody.get("month");
                int serviceId = requestBody.get("service");
                postService.extendPost(userName, postId, month, serviceId);
                List<PostResponse> postResponses = postService.getAllPost().stream()
                        .map(item->PostService.convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                        .toList();
                return ResponseEntity.ok(ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(postResponses)
                        .build());
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .success(false)
                .time(LocalDateTime.now())
                .error(ErrorCode.USER_403.getMessage())
                .build());
    }

    @PostMapping("/service/{postId}")
    public ResponseEntity<?> servicePost(@PathVariable("postId") int postId, @RequestBody Map<String, Integer> requestBody, HttpServletRequest request ) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        if(!userName.isEmpty()){
            if(postService.checkPostOfUser(userName,postId)) {
                int day = requestBody.get("day");
                int serviceId = requestBody.get("service");
                postService.servicePost(userName, postId, day, serviceId);
                List<PostResponse> postResponses = postService.getAllPost().stream()
                        .map(item->PostService.convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                        .toList();
                return ResponseEntity.ok(ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(postResponses)
                        .build());
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                .success(false)
                .time(LocalDateTime.now())
                .error(ErrorCode.USER_403.getMessage())
                .build());

    }

    @GetMapping("/management/post")
    public ResponseEntity<?> postManager(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "postDisplays") String postType){
        Page<PostResponse> postResponses = postService.getPostManager(page,postType);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(postResponses.getTotalPages())
                .content(postResponses.getContent())
                .build();
        return  ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .time(LocalDateTime.now())
                .result(pageResponse)
                .build());
    }

    @GetMapping("/search/suggestions")
    public ResponseEntity<?> searchSuggestions(@RequestParam String query)
    {
        List<String> listSuggestions = postService.suggestions(query);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(listSuggestions)
                        .build()
        );
    }

    @GetMapping("/search/result")
    public ResponseEntity<?> searchResult(@RequestParam String query, @RequestParam(defaultValue = "1")int page,
                                          @RequestParam(required = false) String city,
                                          @RequestParam(required = false) String district,
                                          @RequestParam(required = false) String ward,
                                          @RequestParam(required = false) String roomType)
    {
        Page<PostResponse> postResponses = postService.searchResult(query,page,city,district,ward,roomType);
        PageResponse<?> pageResponse = PageResponse.builder()
                .currentPage(page)
                .totalPage(postResponses.getTotalPages())
                .content(postResponses.getContent())
                .build();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(pageResponse)
                        .build()
        );
    }

}
