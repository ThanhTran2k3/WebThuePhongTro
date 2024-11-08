package WebThuePhongTro.WebThuePhongTro.Repository;

import WebThuePhongTro.WebThuePhongTro.Model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface PostRepository extends JpaRepository<Post,Integer> {


    Page<Post> findByStatusAndApprovalStatusAndExpirationDateAfter(
            boolean status, boolean approvalStatus, LocalDateTime expirationDate, Pageable pageable);

    Page<Post> findByApprovalStatusAndExpirationDateAfter(
            boolean approvalStatus, LocalDateTime expirationDate, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.approvalStatus IS NULL AND expirationDate > :expirationDate")
    Page<Post> findByApprovalStatusNullableAndExpirationDateAfter(
           LocalDateTime expirationDate, Pageable pageable);

    @Query(value = "SELECT * FROM post WHERE title COLLATE Latin1_General_CI_AI LIKE %:query% " +
            "AND status = 1 AND approval_status = 1 AND expiration_date > :expirationDate", nativeQuery = true)
    Page<Post> searchPosts(@Param("query") String query,@Param("expirationDate") LocalDateTime expirationDate, Pageable pageable);

}
