package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.PostRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PostResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.*;
import WebThuePhongTro.WebThuePhongTro.Repository.PostCategoryRepository;
import WebThuePhongTro.WebThuePhongTro.Repository.PostImagesRepository;
import WebThuePhongTro.WebThuePhongTro.Repository.PostRepository;
import WebThuePhongTro.WebThuePhongTro.Repository.UserPostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;

    private final PostImagesRepository postImagesRepository;

    private final PostCategoryRepository postCategoryRepository;

    private final UserPostService userPostService;

    private final UserService userService;

    private final WebService webService;

    private final InvoiceService invoiceService;

    private final PostCategoryService postCategoryService;

    public Page<Post> getAllPost(int page){
        Pageable pageable = PageRequest.of(page-1, 3);
        return postRepository.findAll(pageable);
    }

    public List<Post> getAllPost(){

        return postRepository.findAll();
    }

    public void addPost(User user, PostRequest postRequest) throws IOException {
        Post post = Post.builder()
                .title(postRequest.getTitle())
                .area(postRequest.getArea())
                .city(postRequest.getCity())
                .district(postRequest.getDistrict())
                .wards(postRequest.getWards())
                .address(postRequest.getAddress())
                .description(postRequest.getDescription())
                .deposit(postRequest.getDeposit())
                .rentPrice(postRequest.getRentPrice())
                .roomType(postRequest.getRoomType())
                .postingDate(LocalDateTime.now())
                .expirationDate(LocalDateTime.now().plusMonths(2))
                .status(false)
                .postCategory(postCategoryRepository.findById(1).orElseThrow())
                .build();
        Set<PostImages> images = new HashSet<>();
        for (MultipartFile image : postRequest.getFiles()) {
            PostImages postImages = new PostImages();
            postImages.setUrlImage(saveImage(image));
            postImages.setPost(post);
            images.add(postImages);
        }
        post.setPostImages(images);
        UserPost userPost = new UserPost();
        userPost.setUser(user);
        userPost.setPost(post);
        userPost.setLiked(false);
        userPost.setUserCreate(true);

        postRepository.save(post);
        userPostService.save(userPost);
    }

    public Post getPostId(int id) {
        return postRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.POST_NOT_EXIST));
    }

    public void updatePost(Post post) {
        postRepository.save(post);
    }

    public void editPost(int postId,PostRequest postRequest) throws IOException {
        Post post = getPostId(postId);

        post.setTitle(postRequest.getTitle());
        post.setArea(postRequest.getArea());
        post.setCity(postRequest.getCity());
        post.setDistrict(postRequest.getDistrict());
        post.setWards(postRequest.getWards());
        post.setAddress(postRequest.getAddress());
        post.setDescription(postRequest.getDescription());
        post.setRentPrice(postRequest.getRentPrice());
        post.setDeposit(postRequest.getDeposit());
        post.setRoomType(postRequest.getRoomType());

        if(postRequest.getFiles() != null && postRequest.getFiles().length > 0){
            deleteImage(post.getPostId());
            Set<PostImages> images = new HashSet<>();
            for (MultipartFile image : postRequest.getFiles()) {
                PostImages postImages = new PostImages();
                postImages.setUrlImage(saveImage(image));
                postImages.setPost(post);
                images.add(postImages);
            }
            post.setPostImages(images);
        }

        updatePost(post);
    }

    public void deletePostById(int id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new IllegalStateException("Post does not exist."));
        post.setStatus(false);
        postRepository.save(post);
    }

    public String saveImage(MultipartFile image) throws IOException {
        File staticImagesFolder = new File("target/classes/static/images");
        File imagesFolder = new File("src/main/resources/static/images");

        if (!staticImagesFolder.exists()) {
            staticImagesFolder.mkdirs();
        }
        String fileName =Math.random() + image.getOriginalFilename();
        Path path = Paths.get(staticImagesFolder.getAbsolutePath() + File.separator + fileName);
        Path pathCopy = Paths.get(imagesFolder.getAbsolutePath() + File.separator + fileName);
        Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        Files.copy(image.getInputStream(), pathCopy, StandardCopyOption.REPLACE_EXISTING);
        return "/images/" + fileName;
    }

    public void deleteImage(int postId){

        postImagesRepository.deleteByPostId(postId);

    }

    public static PostResponse convertToDTO(Post post) {
        return PostResponse.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .area(post.getArea())
                .city(post.getCity())
                .district(post.getDistrict())
                .wards(post.getWards())
                .address(post.getAddress())
                .description(post.getDescription())
                .rentPrice(post.getRentPrice())
                .deposit(post.getDeposit())
                .postingDate(post.getPostingDate())
                .expirationDate(post.getExpirationDate())
                .postImages(post.getPostImages())
                .postCategory(post.getPostCategory())
                .status(post.isStatus())
                .approvalStatus(post.getApprovalStatus())
                .build();
    }

    public void likePost(String userName, int postId){
        Post post = getPostId(postId);
        User user = userService.findByUserName(userName);
        if(!checkPostOfUser(userName,postId)){
            if(userPostService.checkLike(user.getUserId(),post.getPostId())){
                userPostService.deleteUserPost(user.getUserId(),post.getPostId());
            }
            else{
                UserPost userPost = UserPost.builder()
                        .user(user)
                        .post(post)
                        .isLiked(true)
                        .build();
                userPostService.save(userPost);
            }
        }
        else{
            boolean isLike = userPostService.checkLike(user.getUserId(),post.getPostId());
            userPostService.updateUserPost(user.getUserId(),post.getPostId(),!isLike);
        }
    }

    public boolean checkPostOfUser(String userName, int postId){
        User user = userService.findByUserName(userName);
        User userPost = userPostService.getUserCreatePost(postId);
        return user.equals(userPost);
    }

    public void extendPost(String authUserName,int postId, int month, int serviceId){
        Post post = getPostId(postId);
        User user = userService.findByUserName(authUserName);
        Services services = webService.getServiceById(serviceId);
        BigDecimal total = BigDecimal.valueOf(month).multiply(services.getPrice());
        Invoice invoice = Invoice.builder()
                .issueDate(LocalDateTime.now())
                .totalAmount(total)
                .content("Gia hạn \""+post.getTitle()+"\" thêm "+month+" tháng")
                .service(services)
                .post(post)
                .user(user)
                .build();

        if (post.getExpirationDate() == null || post.getExpirationDate().isBefore(LocalDateTime.now()))
            post.setExpirationDate(LocalDateTime.now().plusMonths(month));
        else
            post.setExpirationDate(post.getExpirationDate().plusMonths(month));

        user.setBalance(user.getBalance().subtract(total));
        invoiceService.addInvoice(invoice);
        userService.updateUser(user);
        updatePost(post);
    }

    public void servicePost(String authUserName,int postId, int day, int serviceId){
        Post post = getPostId(postId);
        User user = userService.findByUserName(authUserName);
        Services services = webService.getServiceById(serviceId);
        BigDecimal total = BigDecimal.valueOf(day).multiply(services.getPrice());
        Invoice invoice = Invoice.builder()
                .issueDate(LocalDateTime.now())
                .totalAmount(total)
                .content(services.getServiceName()+" cho bài đăng \""+post.getTitle()+"\" trong "+day+" ngày")
                .service(services)
                .post(post)
                .user(user)
                .build();

        PostCategory postCategory = postCategoryService.getPostCategoryByCategoryName(services.getServiceName());
        post.setServiceEndDate(LocalDateTime.now().plusDays(day));
        post.setPostCategory(postCategory);
        user.setBalance(user.getBalance().subtract(total));
        invoiceService.addInvoice(invoice);
        userService.updateUser(user);
        updatePost(post);
    }

}
