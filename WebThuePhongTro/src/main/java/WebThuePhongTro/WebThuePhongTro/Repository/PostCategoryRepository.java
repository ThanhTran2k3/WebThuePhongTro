package WebThuePhongTro.WebThuePhongTro.Repository;

import WebThuePhongTro.WebThuePhongTro.Model.PostCategory;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostCategoryRepository extends JpaRepository<PostCategory,Integer> {
    Optional<PostCategory> findByCategoryName(String categoryName);
}
