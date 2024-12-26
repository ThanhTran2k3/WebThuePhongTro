package WebThuePhongTro.WebThuePhongTro.Model;

import WebThuePhongTro.WebThuePhongTro.Validator.CreateGroup;
import WebThuePhongTro.WebThuePhongTro.Validator.EditGroup;
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
    private String title;

    @Column(nullable = false)
    private double area;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    private String city ;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    private String district;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    private String wards;

    @Column(nullable = false, columnDefinition = "nvarchar(255)")
    private String address;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false,columnDefinition = "nvarchar(MAX)")
    private String description;

    @Column(nullable = false)
    private BigDecimal rentPrice;

    @Column(nullable = false)
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
