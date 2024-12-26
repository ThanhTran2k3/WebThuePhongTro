package WebThuePhongTro.WebThuePhongTro.Exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    ERROR_USER_LOGIN(9999,"Tên người dùng hoặc mật khẩu không hợp lệ"),
    BLOCK_ACCOUNT(9998,"Tài khoản đang bị khóa"),
    ERROR_CHANGE_PASSWORD(9997,"Mật khẩu hiện tại không đúng"),
    ERROR_SEND_EMAIL(9996,"Lỗi gửi xác thực OTP"),
    ERROR_OTP(9995,"OTP không hợp lệ"),
    USER_EXIST(1001,"Người dùng đã tồn tại"),
    USER_NOT_EXIST(1002,"Người dùng không tồn tại"),
    USER_403(403,"Người dùng không có quyền truy cập"),
    POST_NOT_EXIST(3000,"Bài đăng không tồn tại"),
    SERVICE_NOT_EXIST(3001,"Dịch vụ không tồn tại"),
    CATEGORY_NOT_EXIST(3002,"Loại bài đăng không tồn tại"),
    REVIEWS_NOT_EXIST(3003,"Bình luận không tồn tại"),
    USER_NOT_REVIEWS(1003,"Người dùng không thể tự đánh giá"),
    ;

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code =code;
        this.message = message;
    }

}
