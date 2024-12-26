package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService{


    private final JavaMailSender emailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Your OTP Code");
            helper.setText(buildHtmlEmailContent(otp), true);

            emailSender.send(message);

        } catch (MessagingException e) {
            throw new AppException(ErrorCode.ERROR_SEND_EMAIL);
        }
    }

    private String buildHtmlEmailContent(String otp) {
        return "<html>" +
                "<head><style>" +
                "body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; }" +
                "h2 { color: #4CAF50; }" +
                ".otp-code { font-size: 24px; font-weight: bold; color: #333; background-color: #e7f7e7; padding: 10px; border-radius: 5px; }" +
                "</style></head>" +
                "<body>" +
                "<h2>Your OTP Code</h2>" +
                "<p>Dear User,</p>" +
                "<p>Thank you for using our service. Your OTP code is:</p>" +
                "<p class='otp-code'>" + otp + "</p>" +
                "<p>If you did not request this, please ignore this email.</p>" +
                "<p>Best regards,<br>Trọ24h</p>" +
                "</body>" +
                "</html>";
    }
}
