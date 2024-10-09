package WebThuePhongTro.WebThuePhongTro.Model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Objects;

@Data
@Entity
@Table(name = "PostImages")
public class PostImages{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int postImageId;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    private String urlImage;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(referencedColumnName = "postId", name = "postId")
    private Post post;

    @Override
    public int hashCode() {
        return Objects.hash(postImageId);
    }


}
