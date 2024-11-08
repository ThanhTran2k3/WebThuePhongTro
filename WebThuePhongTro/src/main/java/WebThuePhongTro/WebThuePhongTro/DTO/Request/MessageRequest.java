package WebThuePhongTro.WebThuePhongTro.DTO.Request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageRequest {

    private String senderName;
    private String receiverName;
    private String content;
    private LocalDateTime timestamp;
}
