package WebThuePhongTro.WebThuePhongTro.Repository;

import WebThuePhongTro.WebThuePhongTro.Model.Post;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Model.UserPost;
import WebThuePhongTro.WebThuePhongTro.Model.UserPostId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserPostRepository extends JpaRepository<UserPost, UserPostId> {

    @Query("SELECT up.user FROM UserPost up WHERE up.post.postId = :postId AND up.userCreate = true")
    User getUser(@Param("postId") int postId);

    @Query("SELECT up.post FROM UserPost up WHERE up.user.userId = :userId AND up.isLiked = true")
    List<Post> getLikePostOfUser(@Param("userId") int userId);

    @Query("SELECT up.post FROM UserPost up WHERE up.user.userId = :userId AND up.userCreate = true")
    List<Post> getPostCreateByUser(@Param("userId") int userId);

    @Query("SELECT CASE WHEN (EXISTS (SELECT 1 FROM UserPost up WHERE up.user.userId = :userId AND up.post.postId = :postId AND up.isLiked = true)) THEN true ELSE false END")
    boolean checkLike(@Param("userId") int userId, @Param("postId") int postId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserPost up WHERE up.user.userId = :userId AND up.post.postId = :postId")
    void deleteByPostId(@Param("userId") int userId,@Param("postId")int postId);

    @Modifying
    @Transactional
    @Query("UPDATE UserPost up SET up.isLiked = :isLike  WHERE up.user.userId = :userId AND up.post.postId = :postId")
    void update(@Param("userId") int userId,@Param("postId")int postId,@Param("isLike")boolean isLike);


}
