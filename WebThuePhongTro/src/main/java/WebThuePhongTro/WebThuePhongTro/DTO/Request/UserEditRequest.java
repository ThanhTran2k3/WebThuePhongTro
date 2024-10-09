package WebThuePhongTro.WebThuePhongTro.DTO.Request;

import WebThuePhongTro.WebThuePhongTro.Validator.Unique;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class UserEditRequest {
    private MultipartFile avatar;

    @NotBlank(message = "Tên người dùng không được bỏ trống")
    @Unique(message = "Tên người dùng đã được dùng")
    @Size(min = 5, max = 50, message = "Tên người dùng từ 5 đến 50 ký tự")
    private String userName;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min =5 , message = "Họ và tên ít nhất 5 ký tự")
    private String fullName;

    @NotNull(message = "Ngày sinh không được bỏ trống")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private LocalDate birthDate;

    @Size(min = 10, max = 10, message = "Số điện thoại phải có 10 số")
    @Pattern(regexp = "[0][0-9]*$", message = "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số")
    @Unique(message = "Số điện thoại đã tồn tại")
    private String phoneNumber;

    @NotBlank(message = "Email không được bỏ trống")
    @Size(min = 1, max = 50, message = "Email không quá 50 ký tự")
    @Email(message = "Email không hợp lệ")
    @Unique(message = "Email đã tồn tại")
    private String email;

    @NotBlank(message = "Tỉnh thành không được để trống")
    private String city ;

    @NotBlank(message = "Quận huyện không được để trống")
    private String district;

    @NotBlank(message = "Phường xã không được để trống")
    private String wards;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

}
