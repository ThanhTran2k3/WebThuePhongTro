package WebThuePhongTro.WebThuePhongTro.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "PostCategory")
public class PostCategory{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int postCategoryId;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    @NotNull(message = "Tên loại bài đăng không được để trống")
    private String categoryName;

    @OneToMany(mappedBy = "postCategory")
    private Set<Post> posts;
}
