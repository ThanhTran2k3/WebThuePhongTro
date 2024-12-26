package WebThuePhongTro.WebThuePhongTro.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {

    private int messageId;
    private String senderName;
    private String avatarSender;
    private String receiverName;
    private String avatarReceiver;
    private String content;
    private LocalDateTime timestamp;
    private boolean status;
}
