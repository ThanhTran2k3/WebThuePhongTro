package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.MessageResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.UserResponse;
import WebThuePhongTro.WebThuePhongTro.Model.Message;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    private final UserService userService;

    public void saveMessage(Message message) {
        messageRepository.save(message);
    }

    public List<UserResponse> listUserChat(String userName) {
        return messageRepository.findAll().stream()
                .filter(s->s.getSender().getUsername().equals(userName) || s.getReceiver().getUsername().equals(userName))
                .sorted(Comparator.comparing(Message::getTimestamp).reversed())
                .flatMap(message -> Stream.of(
                        message.getSender(),
                        message.getReceiver()
                ))
                .filter(user -> !user.getUsername().equals(userName))
                .distinct()
                .map(userService::convertToUserResponse)
                .toList();

    }

    public List<MessageResponse> detailChat(String userName,String userChat) {
        return messageRepository.findAll().stream()
                .filter(s->(s.getSender().getUsername().equals(userName)&&
                        s.getReceiver().getUsername().equals(userChat))
                        ||(s.getSender().getUsername().equals(userChat)&&
                        s.getReceiver().getUsername().equals(userName)))
                .sorted(Comparator.comparing(Message::getTimestamp))
                .map(this::convertToMessageResponse)
                .toList();

    }

    public MessageResponse convertToMessageResponse(Message message) {
        return MessageResponse.builder()
                .senderName(message.getSender().getUsername())
                .avatarSender(message.getSender().getAvatar())
                .receiverName(message.getReceiver().getUsername())
                .avatarReceiver(message.getReceiver().getAvatar())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}
