package WebThuePhongTro.WebThuePhongTro.Repository;

import WebThuePhongTro.WebThuePhongTro.Model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.status = true WHERE (m.sender.userName = :senderName AND m.receiver.userName = :receiverName) OR (m.sender.userName = :receiverName AND m.receiver.userName = :senderName)")
    void updateStatusForMessages(String senderName, String receiverName);
}