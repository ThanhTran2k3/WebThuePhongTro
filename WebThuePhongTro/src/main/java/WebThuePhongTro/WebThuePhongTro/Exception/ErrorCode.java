package WebThuePhongTro.WebThuePhongTro.Exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    ERROR_USER_LOGIN(9999,"Tên người dùng hoặc mật khẩu không hợp lệ"),
    BLOCK_ACCOUNT(9998,"Tài khoản đang bị khóa"),
    USER_EXIST(1001,"Người dùng đã tồn tại"),
    USER_NOT_EXIST(1002,"Người dùng không tồn tại"),
    POST_NOT_EXIST(2001,"Bài đăng không tồn tại"),
    SERVICE_NOT_EXIST(3001,"Dịch vụ không tồn tại"),
    CATEGORY_NOT_EXIST(3001,"Loại bài đăng không tồn tại"),
    ;

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code =code;
        this.message = message;
    }

}
