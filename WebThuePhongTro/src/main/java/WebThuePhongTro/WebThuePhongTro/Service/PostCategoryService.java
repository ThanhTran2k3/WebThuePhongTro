package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.PostCategory;
import WebThuePhongTro.WebThuePhongTro.Model.RoomType;
import WebThuePhongTro.WebThuePhongTro.Repository.PostCategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PostCategoryService {
    private final PostCategoryRepository postCategoryRepository;

    public PostCategory getPostCategoryByCategoryName(String categoryName) {
        return postCategoryRepository.findByCategoryName(categoryName).orElseThrow(()-> new AppException(ErrorCode.CATEGORY_NOT_EXIST));
    }
}
