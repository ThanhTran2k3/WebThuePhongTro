package WebThuePhongTro.WebThuePhongTro.DTO.Request;

import WebThuePhongTro.WebThuePhongTro.Model.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class PostRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @Min(value = 1,message = "Diện tích phải lớn hơn 1")
    @NotNull(message = "Diện tích không được để trống")
    private double area;

    @NotBlank(message = "Tỉnh thành không được để trống")
    private String city ;

    @NotBlank(message = "Quận huyện không được để trống")
    private String district;

    @NotBlank(message = "Phường xã không được để trống")
    private String wards;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(min = 5,message = "Mô tả phải nhiều hơn 5 ký tự")
    private String description;

    @Min(value = 1,message = "Giá thuê phải lớn hơn 0đ")
    private BigDecimal rentPrice;

    @Min(value = 0,message = "Tiền cọc không nhỏ hơn 0đ")
    private BigDecimal deposit;

    private RoomType roomType;

    @NotNull(message = "Ảnh bài đăng không được để trống")
    private MultipartFile[] files;
}
