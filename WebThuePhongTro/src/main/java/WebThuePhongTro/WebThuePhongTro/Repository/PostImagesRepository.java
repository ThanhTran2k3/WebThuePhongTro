package WebThuePhongTro.WebThuePhongTro.Repository;

import WebThuePhongTro.WebThuePhongTro.Model.PostImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PostImagesRepository extends JpaRepository<PostImages,Integer> {

    @Modifying
    @Transactional
    @Query("DELETE FROM PostImages pi WHERE pi.post.postId = :postId")
    void deleteByPostId(@Param("postId")int postId);
}
