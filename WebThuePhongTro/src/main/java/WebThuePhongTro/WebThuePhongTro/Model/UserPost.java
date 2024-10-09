package WebThuePhongTro.WebThuePhongTro.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@IdClass(UserPostId.class)
@Table(name = "User_Post")
public class UserPost {

    @Id
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "postId")
    private Post post;

    @Column(nullable = false)
    private boolean isLiked;

    private Boolean userCreate;
}
