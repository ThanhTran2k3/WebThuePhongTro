package WebThuePhongTro.WebThuePhongTro.DTO.Request;

import WebThuePhongTro.WebThuePhongTro.Model.RoomType;
import WebThuePhongTro.WebThuePhongTro.Validator.CreateGroup;
import WebThuePhongTro.WebThuePhongTro.Validator.EditGroup;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class PostRequest {

    @NotBlank(message = "Tiêu đề không được để trống", groups = {CreateGroup.class, EditGroup.class})
    private String title;

    @Min(value = 1,message = "Diện tích phải lớn hơn 1", groups = {CreateGroup.class, EditGroup.class})
    @NotNull(message = "Diện tích không được để trống", groups = {CreateGroup.class, EditGroup.class})
    private double area;

    @NotBlank(message = "Tỉnh thành không được để trống", groups = {CreateGroup.class, EditGroup.class})
    private String city ;

    @NotBlank(message = "Quận huyện không được để trống", groups = {CreateGroup.class, EditGroup.class})
    private String district;

    @NotBlank(message = "Phường xã không được để trống", groups = {CreateGroup.class, EditGroup.class})
    private String wards;

    @NotBlank(message = "Địa chỉ không được để trống", groups = {CreateGroup.class, EditGroup.class})
    private String address;

    @NotNull(message = "Vĩ độ không được để trống", groups = {CreateGroup.class, EditGroup.class})
    private double latitude;

    @NotNull(message = "Kinh độ không được để trống", groups = {CreateGroup.class, EditGroup.class})
    private double longitude;

    @NotBlank(message = "Mô tả không được để trống", groups = {CreateGroup.class, EditGroup.class})
    @Size(min = 5,message = "Mô tả phải nhiều hơn 5 ký tự", groups = {CreateGroup.class, EditGroup.class})
    private String description;

    @Min(value = 1,message = "Giá thuê phải lớn hơn 0đ", groups = {CreateGroup.class, EditGroup.class})
    private BigDecimal rentPrice;

    @Min(value = 0,message = "Tiền cọc không nhỏ hơn 0đ", groups = {CreateGroup.class, EditGroup.class})
    private BigDecimal deposit;

    private RoomType roomType;

    @NotNull(message = "Ảnh bài đăng không được để trống", groups = {CreateGroup.class})
    private MultipartFile[] files;
}
