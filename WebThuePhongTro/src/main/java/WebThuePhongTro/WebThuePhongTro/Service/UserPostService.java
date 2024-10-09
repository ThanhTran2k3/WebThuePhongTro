package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.Model.Post;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Model.UserPost;
import WebThuePhongTro.WebThuePhongTro.Repository.UserPostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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

    public List<Post> getPostCreateByUser(int userId){
        return userPostRepository.getPostCreateByUser(userId);
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

}
