package WebThuePhongTro.WebThuePhongTro.Configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${jwt.secretKey}")
    private String secretKey;

    private final String[] PUBLIC_GET_URLS = {"/api/post","/api/post/detail/{postId}","/api/roomType"
                                        ,"/api/user/{userName}","/api/payment/confirmPaymentMomo"
                                        ,"/api/service/{postId}","/api/service","/ws/**"};
    private final String[] PUBLIC_POST_URLS ={"/api/auth/log-in","/api/auth/register"};

    private final String[] USER_GET_URLS ={"/api/post/{postId}","/api/invoice/history","/api/user/detail"};
    private final String[] USER_POST_URLS ={"/api/post/add","/api/post/like/{postId}","/api/payment/momo",
                                            "/api/post/extend/{postId}","/api/post/service/{postId}"};
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/images/**", "/css/**", "/js/**","/v3/api-docs/**", "/swagger-ui/**").permitAll()
                    .requestMatchers(HttpMethod.GET, PUBLIC_GET_URLS).permitAll()
                    .requestMatchers(HttpMethod.POST,PUBLIC_POST_URLS).permitAll()
                    .requestMatchers(HttpMethod.GET,USER_GET_URLS).hasAuthority("SCOPE_ROLE_USER")
                    .requestMatchers(HttpMethod.POST,USER_POST_URLS).hasAuthority("SCOPE_ROLE_USER")
                    .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 ->
                    oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public JwtDecoder jwtDecoder(){

        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HS256");
        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

}
