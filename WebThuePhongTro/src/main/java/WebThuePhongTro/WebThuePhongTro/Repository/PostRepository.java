package WebThuePhongTro.WebThuePhongTro.Repository;

import WebThuePhongTro.WebThuePhongTro.Model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post,Integer> {


    Page<Post> findByStatusAndApprovalStatusAndExpirationDateAfter(
            boolean status, boolean approvalStatus, LocalDateTime expirationDate, Pageable pageable);

    @Query("SELECT p FROM Post p " +
            "WHERE p.status = true " +
            "AND p.approvalStatus = true " +
            "AND p.expirationDate > :expirationDate " +
            "AND (:city IS NULL OR p.city = :city)" +
            "AND (:district IS NULL OR p.district = :district)" +
            "AND (:ward IS NULL OR p.wards = :ward)" +
            "AND (:roomType IS NULL OR p.roomType.typeRoomName = :roomType)" +
            "ORDER BY CASE WHEN p.postCategory.postCategoryId = 3 THEN 0 ELSE 1 END, p.postingDate DESC")
    Page<Post> getPostAndFilters(
            @Param("expirationDate") LocalDateTime expirationDate,
            @Param("city") String city,
            @Param("district") String district,
            @Param("ward") String ward,
            @Param("roomType") String roomType,
            Pageable pageable);

    @Query("SELECT p FROM Post p " +
            "WHERE p.status = true " +
            "AND p.approvalStatus = true " +
            "AND p.expirationDate > :expirationDate " +
            "AND (:city IS NULL OR p.city = :city)" +
            "AND (:district IS NULL OR p.district = :district)" +
            "AND (:ward IS NULL OR p.wards = :ward)" +
            "AND (:roomType IS NULL OR p.roomType.typeRoomName = :roomType)" +
            "ORDER BY CASE WHEN p.postCategory.postCategoryId = 3 THEN 0 ELSE 1 END, p.postingDate DESC")
    List<Post> getPostAndFilters(
            @Param("expirationDate") LocalDateTime expirationDate,
            @Param("city") String city,
            @Param("district") String district,
            @Param("ward") String ward,
            @Param("roomType") String roomType);

    Page<Post> findByApprovalStatusAndExpirationDateAfter(
            boolean approvalStatus, LocalDateTime expirationDate, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.approvalStatus IS NULL AND expirationDate > :expirationDate")
    Page<Post> findByApprovalStatusNullableAndExpirationDateAfter(
           LocalDateTime expirationDate, Pageable pageable);

    @Query(value = "SELECT p.* FROM post p " +
            "INNER JOIN room_type r ON p.room_type_id = r.room_type_id " +
            "WHERE title COLLATE Latin1_General_CI_AI LIKE %:query% " +
            "AND p.status = 1 AND p.approval_status = 1 AND p.expiration_date > :expirationDate " +
            "AND (:city IS NULL OR p.city = :city)" +
            "AND (:district IS NULL OR p.district = :district)" +
            "AND (:ward IS NULL OR p.wards = :ward)" +
            "AND (:roomType IS NULL OR r.type_room_name = :roomType)"
            ,nativeQuery = true)
    Page<Post> searchPosts(@Param("query") String query,
                           @Param("expirationDate") LocalDateTime expirationDate,
                           @Param("city") String city,
                           @Param("district") String district,
                           @Param("ward") String ward,
                           @Param("roomType") String roomType,
                           Pageable pageable);

}
