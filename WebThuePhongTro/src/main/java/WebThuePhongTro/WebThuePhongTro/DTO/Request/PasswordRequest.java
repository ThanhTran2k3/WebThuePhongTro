package WebThuePhongTro.WebThuePhongTro.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordRequest {

    private String oldPassword;

    @NotBlank(message = "Mật khẩu không được bỏ trống")
    @Pattern(regexp = "^[A-Z].*(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$",message = "Mật khẩu bắt đầu bằng chữ hoa, có 1 số và 1 kí tự đặc biệt")
    @Size(min = 8, message = "Mật khẩu phải từ 8 ký tự")
    private String newPassword;

    @NotNull
    private String email;
}
