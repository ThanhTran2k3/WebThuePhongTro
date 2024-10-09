package WebThuePhongTro.WebThuePhongTro.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "Post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int postId;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @Column(nullable = false)
    @Min(value = 1,message = "Giá trị phải lớn hơn 1")
    private double area;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Tỉnh thành không được để trống")
    private String city ;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Quận huyện không được để trống")
    private String district;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Phường xã không được để trống")
    private String wards;

    @Column(nullable = false, columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @Column(nullable = false,columnDefinition = "nvarchar(MAX)")
    @NotBlank(message = "Mô tả không được để trống")
    @Size(min = 5,message = "Mô tả phải nhiều hơn 5 ký tự")
    private String description;

    @Column(nullable = false)
    @Min(value = 1,message = "Giá thuê phải lớn hơn 0đ")
    private BigDecimal rentPrice;

    @Column(nullable = false)
    @Min(value = 0,message = "Tiền cọc không được âm")
    private BigDecimal deposit;

    @Column(nullable = false)
    private LocalDateTime postingDate;

    @Column(nullable = false)
    private LocalDateTime expirationDate;

    private LocalDateTime serviceEndDate;

    @Column(nullable = false)
    private boolean status;

    private Boolean approvalStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "postCategoryId", name = "postCategoryId")
    private PostCategory postCategory;


    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    private Set<PostImages> postImages;

    @ManyToOne
    @JoinColumn(referencedColumnName = "roomTypeId", name = "roomTypeId")
    private RoomType roomType;

    @OneToMany(mappedBy = "post")
    private Set<Invoice> invoices;

    @OneToMany(mappedBy = "post")
    Set<UserPost> userPosts;

}
