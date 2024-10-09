package WebThuePhongTro.WebThuePhongTro.Model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private String content;
    private String senderName;
    private String recipientName;
    private LocalDateTime timestamp;
    private MessageType type;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}