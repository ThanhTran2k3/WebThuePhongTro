package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.Model.ChatMessage;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/sendMessage")
    public void sendMessage(@Payload  ChatMessage chatMessage) {
        String destination = "/queue/messages/" + chatMessage.getRecipientName();
        messagingTemplate.convertAndSendToUser(chatMessage.getRecipientName(), destination, chatMessage);
    }
}
