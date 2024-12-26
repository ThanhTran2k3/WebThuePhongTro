package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.MessageResponse;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.UserMessageResponse;
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
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;


    public void saveMessage(Message message) {
        messageRepository.save(message);
    }
    public MessageResponse updateMessage(int messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow();
        message.setStatus(true);

        return convertToMessageResponse(message);
    }

    public void updateListMessages(String senderName, String receiverName) {
        List<Message> messages = messageRepository.findAll()
                .stream()
                .filter( m->
                        ((m.getSender().getUsername().equals(senderName)
                                && m.getReceiver().getUsername().equals(receiverName))
                                || (m.getSender().getUsername().equals(receiverName)
                                && m.getReceiver().getUsername().equals(senderName))))
                .toList();
        List<Message> messagesToUpdate = messages.stream().filter(m -> !m.isStatus()).toList();
        messagesToUpdate.forEach(message -> message.setStatus(true));
        messageRepository.saveAll(messagesToUpdate);
    }

    public List<MessageResponse> detailMessage(String senderName, String receiverName) {
        return messageRepository.findAll()
                .stream()
                .filter( m->
                        ((m.getSender().getUsername().equals(senderName)
                                && m.getReceiver().getUsername().equals(receiverName))
                                || (m.getSender().getUsername().equals(receiverName)
                                && m.getReceiver().getUsername().equals(senderName))))
                .map(this::convertToMessageResponse)
                .toList();
    }

    public long unreadCount(String userName){
        return messageRepository.findAll().stream()
                .filter(message -> !message.isStatus()
                        &&message.getReceiver().getUsername().equals(userName))
                .count();


    }

    public List<UserMessageResponse> listUserChat(String userName) {
        Map<String, Integer> unreadCounts = messageRepository.findAll().stream()
                .filter(message -> !message.isStatus() && message.getReceiver().getUsername().equals(userName))
                .collect(Collectors.groupingBy
                        (user -> user.getSender().getUsername()
                                ,Collectors.collectingAndThen(Collectors.counting(), Long::intValue)));
        return messageRepository.findAll().stream()
                .filter(s->s.getSender().getUsername().equals(userName) || s.getReceiver().getUsername().equals(userName))
                .sorted(Comparator.comparing(Message::getTimestamp).reversed())
                .flatMap(message -> Stream.of(
                        message.getSender(),
                        message.getReceiver()
                ))
                .filter(user -> !user.getUsername().equals(userName))
                .distinct()
                .map(user -> {
                    int unreadCount =  unreadCounts.getOrDefault(user.getUsername(), 0);
                    return UserMessageResponse.builder()
                            .userId(user.getUserId())
                            .avatar(user.getAvatar())
                            .userName(user.getUsername())
                            .unreadMessageCount(unreadCount)
                            .build();
                })
                .toList();

    }



    public MessageResponse convertToMessageResponse(Message message) {
        return MessageResponse.builder()
                .messageId(message.getMessageId())
                .senderName(message.getSender().getUsername())
                .avatarSender(message.getSender().getAvatar())
                .receiverName(message.getReceiver().getUsername())
                .avatarReceiver(message.getReceiver().getAvatar())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .status(message.isStatus())
                .build();
    }
}
