package WebThuePhongTro.WebThuePhongTro.DTO.Request;

import WebThuePhongTro.WebThuePhongTro.Validator.Unique;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthenticationRegisterRequest {

    @NotBlank(message = "Tên người dùng không được bỏ trống")
    @Unique(message = "Tên người dùng đã được dùng")
    @Size(min = 5, max = 50, message = "Tên người dùng từ 5 đến 50 ký tự")
    private String userName;

    @Size(min = 10, max = 10, message = "Số điện thoại phải có 10 số")
    @Pattern(regexp = "[0][0-9]*$", message = "Số điện thoại không hợp lệ")
    @Unique(message = "Số điện thoại đã tồn tại")
    private String phoneNumber;

    @NotBlank(message = "Email không được bỏ trống")
    @Size(min = 1, max = 50, message = "Email không quá 50 ký tự")
    @Email(message = "Email không hợp lệ")
    @Unique(message = "Email đã tồn tại")
    private String email;

    @NotBlank(message = "Mật khẩu không được bỏ trống")
    @Pattern(regexp = "^[A-Z].*(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$",message = "Mật khẩu bắt đầu bằng chữ hoa, có 1 số và 1 kí tự đặc biệt")
    @Size(min = 8, message = "Mật khẩu phải từ 8 ký tự")
    private String password;
}
