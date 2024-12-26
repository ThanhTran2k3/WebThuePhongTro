package WebThuePhongTro.WebThuePhongTro.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
public class MapService {

    @Value("${map.Key}")
    private String mapKey;

    public double getDistance(String origin, String destination) throws JsonProcessingException {
        String url = String.format(
                "https://maps.googleapis.com/maps/api/distancematrix/json?origins=%s&destinations=%s&key=%s",
                origin, destination, mapKey
        );

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        try {
            JsonNode root = new ObjectMapper().readTree(response.getBody());
            JsonNode rows = root.path("rows").get(0).path("elements").get(0);

            if (rows.path("status").asText().equals("OK")) {
                double distanceMeters = rows.path("distance").path("value").asDouble();
                return distanceMeters / 1000;
            } else {
                throw new RuntimeException("Unable to calculate distance: " + rows.path("status").asText());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error parsing Google API response", e);
        }
    }
}
