package WebThuePhongTro.WebThuePhongTro.Service;

import org.apache.commons.codec.binary.Hex;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.Map;

@Service
public class MoMoPaymentService {

    private static final String PARTNER_CODE = "MOMOOJOI20210710";
    private static final String ACCESS_KEY = "iPXneGmrJH0G8FOP";
    private static final String SECRET_KEY = "sFcbSGRSJjwGxwhhcEktCHWYUuTuPNDB";
    private static final String ENDPOINT = "https://test-payment.momo.vn/gw_payment/transactionProcessor";

    public String createPaymentRequest(String orderId, String requestId, Long amount, String orderInfo, String returnUrl, String notifyUrl) {
        try {
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("partnerCode", PARTNER_CODE);
            requestBody.put("accessKey", ACCESS_KEY);
            requestBody.put("requestId", requestId);
            requestBody.put("orderId", orderId);
            requestBody.put("amount", String.valueOf(amount));
            requestBody.put("orderInfo", orderInfo);
            requestBody.put("returnUrl", returnUrl);
            requestBody.put("notifyUrl", notifyUrl);
            requestBody.put("requestType", "captureMoMoWallet");

            // Tính toán chữ ký (signature)
            String rawData = String.format(
                    "partnerCode=%s&accessKey=%s&requestId=%s&amount=%d&orderId=%s&orderInfo=%s&returnUrl=%s&notifyUrl=%s&extraData=%s",
                    PARTNER_CODE, ACCESS_KEY, requestId, amount, orderId, orderInfo, returnUrl, notifyUrl, "");

            String signature = generateSignature(rawData);

            requestBody.put("signature", signature);

            // Gửi yêu cầu tới MoMo
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            // Thực hiện yêu cầu POST tới MoMo
            ResponseEntity<String> response = restTemplate.exchange(ENDPOINT, HttpMethod.POST, entity, String.class);

            return response.getBody(); // Trả về kết quả từ MoMo
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Hàm tạo chữ ký (signature) sử dụng HMAC SHA256
    private String generateSignature(String data) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(MoMoPaymentService.SECRET_KEY.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        return Hex.encodeHexString(sha256_HMAC.doFinal(data.getBytes()));
    }
}
