package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.PostResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Post;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Model.UserPost;
import WebThuePhongTro.WebThuePhongTro.Repository.UserPostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserPostService {

    private final UserPostRepository userPostRepository;


    public void save(UserPost userPost){
        userPostRepository.save(userPost);
    }


    public User getUserCreatePost(int postId){
        return userPostRepository.getUser(postId);
    }

    public List<Post> getLikePostOfUser(int userId)
    {
        return userPostRepository.getLikePostOfUser(userId);
    }

    public void deleteUserPost(int userId, int postId){
        userPostRepository.deleteByPostId(userId,postId);
    }

    public void updateUserPost(int userId,int postId,boolean isLike){
        userPostRepository.update(userId,postId,isLike);
    }

    public boolean checkLike(int userId, int postId){
        return userPostRepository.checkLike(userId,postId);
    }

    public Page<PostResponse> getPostOfUser(int userId, int page,String postType){
        Pageable pageable = PageRequest.of(page-1, 4,Sort.by(Sort.Direction.DESC, "post.postingDate"));
        return switch (postType) {
            case "postDisplays" ->
                    userPostRepository.getPostShowOfUser(userId, pageable).map(item ->
                            PostService.convertToDTO(item,userPostRepository.getUser(item.getPostId()).getUsername()));
            case "postHidden" ->
                    userPostRepository.getPostHiddenOfUser(userId, pageable).map(item ->
                            PostService.convertToDTO(item,userPostRepository.getUser(item.getPostId()).getUsername()));
            case "postExpired" ->
                    userPostRepository.getPostExpiredOfUser(userId, pageable).map(item ->
                            PostService.convertToDTO(item,userPostRepository.getUser(item.getPostId()).getUsername()));
            case "postPending" ->
                    userPostRepository.getPostPendingOfUser(userId, pageable).map(item ->
                            PostService.convertToDTO(item,userPostRepository.getUser(item.getPostId()).getUsername()));
            default -> userPostRepository.getPostRejectedOfUser(userId, pageable).map(item ->
                            PostService.convertToDTO(item,userPostRepository.getUser(item.getPostId()).getUsername()));
        };
    }
}
