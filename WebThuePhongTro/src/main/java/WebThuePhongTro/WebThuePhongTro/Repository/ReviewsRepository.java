package WebThuePhongTro.WebThuePhongTro.Repository;

import WebThuePhongTro.WebThuePhongTro.Model.Reviews;
import WebThuePhongTro.WebThuePhongTro.Model.Services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews,Integer> {
    @Query("SELECT s FROM Reviews s WHERE s.reviewedUser.userName = :userName AND s.status = true")
    Page<Reviews> getReviewsUser(@Param("userName") String userName, Pageable pageable);
}
