package WebThuePhongTro.WebThuePhongTro.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Reviews")
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reviewsId;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    private String content;

    @Column(nullable = false)
    private boolean status;

    @Column(nullable = false)
    private LocalDateTime time;

    @ManyToOne
    @JoinColumn(name = "reviewerId", nullable = false)
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewedUserId", nullable = false)
    private User reviewedUser;
}
