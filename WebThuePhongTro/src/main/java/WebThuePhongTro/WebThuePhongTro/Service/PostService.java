package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.PostRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.PostResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.*;
import WebThuePhongTro.WebThuePhongTro.Repository.PostCategoryRepository;
import WebThuePhongTro.WebThuePhongTro.Repository.PostImagesRepository;
import WebThuePhongTro.WebThuePhongTro.Repository.PostRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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

    private final MapService mapService;

    public Page<PostResponse> getAllPost(int page, String city, String district, String ward, String roomType){
        Pageable pageable = PageRequest.of(page-1, 8);
        return postRepository.getPostAndFilters(LocalDateTime.now(),city,district,ward,roomType,pageable)
                .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()));
    }

    public List<PostResponse> getRegion(String s,String city, String district, String ward, String roomType){
        List<Post> listPost = postRepository.getPostAndFilters(LocalDateTime.now(),city,district,ward,roomType);
        if(s == null || s.isEmpty()){
            return listPost.stream()
                    .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                    .toList();
        }
        String query = removeAccent(s);
        List<String> wordsInQuery = splitIntoWords(query);
        return listPost.stream()
                .filter(post -> {
                    String paragraph = buildParagraph(post);
                    String paragraphRemove = removeAccent(paragraph);
                    List<String> wordsInParagraph = splitIntoWords(paragraphRemove);
                    int commonWords = calculateCommonWords(wordsInParagraph, wordsInQuery);
                    double similarity = (double) commonWords / wordsInQuery.size();
                    return similarity > 0.5;
                })
                .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                .toList();

    }

    public List<PostResponse> getNewPost(){
       return postRepository.findAll().stream()
               .filter(post->post.isStatus()&& Boolean.TRUE.equals(post.getApprovalStatus())&&post.getExpirationDate().isAfter(LocalDateTime.now()))
               .sorted(Comparator.comparing((Post post) ->
                               post.getPostCategory() != null && post.getPostCategory().getPostCategoryId() == 3 ? 0 : 1)
                       .thenComparing(Comparator.comparing(Post::getPostingDate).reversed()))
               .limit(10)
               .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
               .toList();
    }
    public Map<Integer, Double> calculateDistance(String address){
        List<Post> validPosts = postRepository.findAll().stream()
                .filter(p -> p.isStatus() && Boolean.TRUE.equals(p.getApprovalStatus())
                        && p.getExpirationDate().isAfter(LocalDateTime.now())
                )
                .toList();
        return validPosts.parallelStream()
                .collect(Collectors.toMap(
                        Post::getPostId,
                        post -> {
                            try {
                                return mapService.getDistance(address,
                                        buildFullAddress(post));
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e);
                            }
                        }
                ));
    }
    public List<PostResponse> getNearPost(Post post){
        String address = buildFullAddress(post);
        List<Post> validPosts = postRepository.findAll().stream()
                .filter(p -> p.isStatus() && Boolean.TRUE.equals(p.getApprovalStatus())
                        && p.getExpirationDate().isAfter(LocalDateTime.now())
                        && p.getPostId() != post.getPostId()
                )
                .toList();
        Map<Integer,Double> result = validPosts.parallelStream()
                .collect(Collectors.toMap(
                        Post::getPostId,
                        p -> {
                            try {
                                return mapService.getDistance(address,
                                        buildFullAddress(p));
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e);
                            }
                        }
                ));

        return result.entrySet().stream()
                .filter(entry -> entry.getValue() < 50)
                .sorted(Map.Entry.comparingByValue())
                .limit(10)
                .map(entry -> getPostId(entry.getKey()))
                .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                .sorted(Comparator.comparing(p -> p.getPostCategory() != null && p.getPostCategory().getPostCategoryId() == 3 ? 0 : 1))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getNearPost(String address){
        return calculateDistance(address).entrySet().stream()
                .filter(entry -> entry.getValue() < 50)
                .sorted(Map.Entry.comparingByValue())
                .limit(10)
                .map(entry -> getPostId(entry.getKey()))
                .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                .sorted(Comparator.comparing(p -> p.getPostCategory() != null && p.getPostCategory().getPostCategoryId() == 3 ? 0 : 1))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getNearPost(String address,String city, String district, String ward, String roomType){
        List<Post> validPosts = postRepository.getPostAndFilters(LocalDateTime.now(),city,district,ward,roomType)
                .stream().toList();
        Map<Integer, Double> result =  validPosts.parallelStream()
                .collect(Collectors.toMap(
                        Post::getPostId,
                        post -> {
                            try {
                                return mapService.getDistance(address,
                                        buildFullAddress(post));
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e);
                            }
                        }
                ));
        return result.entrySet().stream()
                .filter(entry -> entry.getValue() < 10)
                .sorted(Map.Entry.comparingByValue())
                .map(entry -> getPostId(entry.getKey()))
                .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                .sorted(Comparator.comparing(p -> p.getPostCategory() != null && p.getPostCategory().getPostCategoryId() == 3 ? 0 : 1))
                .toList();
    }

    public Page<PostResponse> getNearPost(String address,int page, String city, String district, String ward, String roomType){
        Pageable pageable = PageRequest.of(page-1, 8);
        List<Post> validPosts = postRepository.getPostAndFilters(LocalDateTime.now(),city,district,ward,roomType)
                .stream().toList();
        Map<Integer, Double> result =  validPosts.parallelStream()
                .collect(Collectors.toMap(
                        Post::getPostId,
                        post -> {
                            try {
                                return mapService.getDistance(address,
                                        buildFullAddress(post));
                            } catch (JsonProcessingException e) {
                                throw new RuntimeException(e);
                            }
                        }
                ));
        List<PostResponse> postResponses = result.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .map(entry -> getPostId(entry.getKey()))
                .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                .sorted(Comparator.comparing(p -> p.getPostCategory() != null && p.getPostCategory().getPostCategoryId() == 3 ? 0 : 1))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), postResponses.size());
        List<PostResponse> pagedPosts = postResponses.subList(start, end);
        return new PageImpl<>(pagedPosts, pageable, postResponses.size());
    }

    public List<PostResponse> getPostLocation(String address){
        return postRepository.findAll().stream()
                .filter(post->post.isStatus()&&Boolean.TRUE.equals(post.getApprovalStatus())
                        &&post.getExpirationDate().isAfter(LocalDateTime.now())
                        &&post.getCity().toLowerCase().contains(address.toLowerCase())
                )
                .sorted(Comparator.comparing((Post post) ->
                                post.getPostCategory() != null && post.getPostCategory().getPostCategoryId() == 3 ? 0 : 1)
                        .thenComparing(Comparator.comparing(Post::getPostingDate).reversed()))
                .limit(10)
                .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                .toList();
    }

    public Page<PostResponse> getPostManager(int page,String postType){
        Pageable pageable = PageRequest.of(page-1, 8,Sort.by(Sort.Direction.DESC, "postingDate"));

        return switch (postType) {
            case "postDisplays" ->
                    postRepository.
                            findByStatusAndApprovalStatusAndExpirationDateAfter(true,true,LocalDateTime.now(),pageable)
                            .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()));
            case "postPending" ->
                    postRepository.
                            findByApprovalStatusNullableAndExpirationDateAfter(LocalDateTime.now(),pageable)
                            .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()));
            default -> postRepository.findByApprovalStatusAndExpirationDateAfter(false,LocalDateTime.now(),pageable)
                    .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()));
        };
    }

    public List<Post> getAllPost(){

        return postRepository.findAll().stream()
                .filter(s->s.isStatus()&& Boolean.TRUE.equals(s.getApprovalStatus())
                        &&s.getExpirationDate().isAfter(LocalDateTime.now()))
                .toList();
    }

    public void addPost(User user, PostRequest postRequest) throws IOException {
        Post post = Post.builder()
                .title(postRequest.getTitle())
                .area(postRequest.getArea())
                .city(postRequest.getCity())
                .district(postRequest.getDistrict())
                .wards(postRequest.getWards())
                .address(postRequest.getAddress())
                .latitude(postRequest.getLatitude())
                .longitude(postRequest.getLongitude())
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
        post.setApprovalStatus(null);

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

    public void updateStatusPostById(int id,String action) {
        Post post = postRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.POST_NOT_EXIST));
        if(action.equals("delete")){
            post.setStatus(false);
            post.setApprovalStatus(false);
        }
        else {
            post.setStatus(true);
            post.setApprovalStatus(true);
        }

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

    public static PostResponse convertToDTO(Post post, String userName) {
        return PostResponse.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .area(post.getArea())
                .city(post.getCity())
                .district(post.getDistrict())
                .wards(post.getWards())
                .address(post.getAddress())
                .latitude(post.getLatitude())
                .longitude(post.getLongitude())
                .description(post.getDescription())
                .rentPrice(post.getRentPrice())
                .deposit(post.getDeposit())
                .postingDate(post.getPostingDate())
                .expirationDate(post.getExpirationDate())
                .postImages(post.getPostImages())
                .postCategory(post.getPostCategory())
                .roomType(post.getRoomType())
                .status(post.isStatus())
                .approvalStatus(post.getApprovalStatus())
                .userName(userName)
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


    public String removeAccent(String s) {
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("");
    }

    public List<String> suggestions(String s){
        String query = removeAccent(s);

        return getAllPost().stream()
                .map(Post::getTitle)
                .filter(title -> removeAccent(title).toLowerCase().contains(query.toLowerCase()))
                .limit(10)
                .toList();
    }

    public Page<PostResponse> searchResult(String s, int page,String city, String district, String ward, String roomType){
        List<Post> listPost = postRepository.getPostAndFilters(LocalDateTime.now(),city,district,ward,roomType);
        String query = removeAccent(s);
        List<String> wordsInQuery = splitIntoWords(query);

        Pageable pageable = PageRequest.of(page-1, 8,Sort.by(Sort.Direction.DESC, "posting_date"));
        List<PostResponse> postResponses;
        if(wordsInQuery.size()>8){
            postResponses = listPost.stream()
                    .filter(post -> {
                        String paragraph = buildParagraph(post);
                        String paragraphRemove = removeAccent(paragraph);
                        List<String> wordsInParagraph = splitIntoWords(paragraphRemove);
                        int commonWords = calculateCommonWords(wordsInParagraph, wordsInQuery);
                        double similarity = (double) commonWords / wordsInQuery.size();
                        return similarity > 0.4;
                    })
                    .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                    .toList();
        }
        else
            postResponses = listPost.stream()
                    .filter(post -> {
                        String paragraph = buildParagraph(post);
                        String paragraphRemove = removeAccent(paragraph);
                        List<String> wordsInParagraph = splitIntoWords(paragraphRemove);
                        int commonWords = calculateCommonWords(wordsInParagraph, wordsInQuery);
                        double similarity = (double) commonWords / wordsInQuery.size();
                        return similarity > 0.8;
                    })
                    .map(item -> convertToDTO(item,userPostService.getUserCreatePost(item.getPostId()).getUsername()))
                    .toList();



        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), postResponses.size());
        List<PostResponse> pagedPosts = postResponses.subList(start, end);
        return new PageImpl<>(pagedPosts, pageable, postResponses.size());
    }

    public String buildFullAddress(Post post) {
        return String.join(", ", post.getAddress(), post.getWards(), post.getDistrict(), post.getCity());
    }

    private String buildParagraph(Post post){
        return post.getTitle()+" "+post.getArea()+" m2"
                +" "+post.getAddress()+" "+post.getWards()+" "+post.getDistrict()+" "+post.getCity()
                +" "+formatNumber(post.getRentPrice())+" "+formatNumber(post.getDeposit())+" "+post.getDescription();
    }

    private List<String> splitIntoWords(String text) {
        return Arrays.asList(text.toLowerCase().split("\\s+"));
    }

    private int calculateCommonWords(List<String> paragraphWords, List<String> queryWords) {
        Set<String> paragraphSet = new HashSet<>(paragraphWords);
        Set<String> querySet = new HashSet<>(queryWords);
        paragraphSet.retainAll(querySet);

        return paragraphSet.size();
    }

    private String formatNumber(BigDecimal value) {
        BigDecimal oneMillion = new BigDecimal("1000000");
        BigDecimal oneThousand = new BigDecimal("1000");

        if (value.compareTo(oneMillion) >= 0) {
            BigDecimal result = value.divide(oneMillion, 2, RoundingMode.HALF_UP);
            return result.stripTrailingZeros().toPlainString() + " triệu";
        } else if (value.compareTo(oneThousand) >= 0) {
            BigDecimal result = value.divide(oneThousand, 2, RoundingMode.HALF_UP);
            return result.stripTrailingZeros().toPlainString() + " ngàn";
        }
        return value.stripTrailingZeros().toPlainString();
    }
}
