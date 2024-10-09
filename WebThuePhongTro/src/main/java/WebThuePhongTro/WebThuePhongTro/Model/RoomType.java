package WebThuePhongTro.WebThuePhongTro.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "RoomType")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roomTypeId;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Tên loại phòng không được để trống")
    private String typeRoomName;

    @OneToMany(mappedBy = "roomType")
    private Set<Post> posts;

}
