package WebThuePhongTro.WebThuePhongTro.Controller;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.MessageRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.MessageResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.UserResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Message;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Service.AuthenticationService;
import WebThuePhongTro.WebThuePhongTro.Service.InvoiceService;
import WebThuePhongTro.WebThuePhongTro.Service.MessageService;
import WebThuePhongTro.WebThuePhongTro.Service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    @MessageMapping("/sendMessage")
    public void sendMessage(@RequestBody MessageRequest messageRequest) {
        User sender = userService.findByUserName(messageRequest.getSenderName());
        User receiver = userService.findByUserName(messageRequest.getReceiverName());

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(messageRequest.getContent())
                .timestamp(messageRequest.getTimestamp())
                .status(false)
                .build();
        messageService.saveMessage(message);

        MessageResponse messageResponse = messageService.convertToMessageResponse(message);
        messagingTemplate.convertAndSend(
                String.format("/topic/chat/%s/%s", receiver.getUsername(),sender.getUsername()),
                messageResponse
        );
        messagingTemplate.convertAndSend(
                String.format("/topic/chat/%s", receiver.getUsername()),
                messageService.listUserChat(receiver.getUsername())
        );
    }

    @GetMapping("")
    public ResponseEntity<?> listUser(HttpServletRequest request) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(messageService.listUserChat(userName))
                        .build()
        );
    }

    @GetMapping("/detail")
    public ResponseEntity<?> detailChat(HttpServletRequest request, @RequestParam String userChat) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(messageService.detailMessage(userName,userChat))
                        .build()
        );
    }

    @PutMapping("/update")
    public void update(HttpServletRequest request, @RequestParam String receiverName) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        messageService.updateListMessages(userName,receiverName);
        messagingTemplate.convertAndSend(
                String.format("/topic/chat/%s", userName),
                messageService.listUserChat(userName));
    }

    @PutMapping("/update/{messageId}")
    public ResponseEntity<?> update(HttpServletRequest request,@PathVariable int messageId) throws ParseException, JOSEException {
        String userName = authenticationService.getUserName(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .time(LocalDateTime.now())
                        .result(messageService.updateMessage(messageId))
                        .build()
        );
    }
}
