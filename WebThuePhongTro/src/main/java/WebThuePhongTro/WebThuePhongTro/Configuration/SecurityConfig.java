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
                                        ,"/api/service/{postId}","/api/service","/api/user/post/{userName}"
                                        ,"/api/post/search/suggestions","/api/post/search/result"
                                        ,"/api/post/new","/api/post/near","/api/post/city"
                                        ,"/api/reviews/{userName}","/api/post/all","/api/post/near/post"
                                        ,"/api/post/region","/api/post/location"
    };
    private final String[] PUBLIC_POST_URLS ={"/api/auth/log-in","/api/auth/register",
            "/api/otp/send-email","/api/otp/verify-otp","/api/auth/changePassOTP"};

    private final String[] USER_GET_URLS ={"/api/post/{postId}","/api/invoice/history","/api/user/detail","/api/messages","/api/messages/detail"};
    private final String[] USER_POST_URLS ={"/api/post/add","/api/post/like/{postId}","/api/payment/momo",
                                            "/api/post/extend/{postId}","/api/post/service/{postId}"
                                            ,"/api/reviews/add"};
    private final String[] USER_PUT_URLS ={"/api/post/show/{postId}","/api/messages/update"};

    private final String[] EMPLOYEE_GET_URLS ={"/api/invoice","/api/user/role/user","/api/post/management/post"};
    private final String[] EMPLOYEE_PUT_URLS ={"/api/user/block/{userName}","/api/post/status/{postId}"};

    private final String[] ADMIN_GET_URLS ={"/api/user/role/employee","/api/invoice/statistic","/api/invoice/statistic/time","/api/service/manager"};
    private final String[] ADMIN_POST_URLS ={"/api/user/add/employee","/api/service/add"};
    private final String[] ADMIN_PUT_URLS ={"/api/service/edit/{serviceId}","/api/service/show/{serviceId}"};
    private final String[] USER_EMPLOYEE_PUT_URLS ={"/api/reviews/delete/{reviewsId}"};
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
                    .requestMatchers(HttpMethod.PUT,USER_PUT_URLS).hasAuthority("SCOPE_ROLE_USER")
                    .requestMatchers(HttpMethod.GET,EMPLOYEE_GET_URLS).hasAnyAuthority("SCOPE_ROLE_EMPLOYEE","SCOPE_ROLE_ADMIN")
                    .requestMatchers(HttpMethod.PUT,EMPLOYEE_PUT_URLS).hasAnyAuthority("SCOPE_ROLE_EMPLOYEE","SCOPE_ROLE_ADMIN")
                    .requestMatchers(HttpMethod.PUT,USER_EMPLOYEE_PUT_URLS).hasAnyAuthority("SCOPE_ROLE_EMPLOYEE","SCOPE_ROLE_USER")
                    .requestMatchers(HttpMethod.GET,ADMIN_GET_URLS).hasAuthority("SCOPE_ROLE_ADMIN")
                    .requestMatchers(HttpMethod.POST,ADMIN_POST_URLS).hasAuthority("SCOPE_ROLE_ADMIN")
                    .requestMatchers(HttpMethod.PUT,ADMIN_PUT_URLS).hasAuthority("SCOPE_ROLE_ADMIN")
                    .requestMatchers("/ws/**").permitAll()
                    .requestMatchers("/api/auth/changePass").authenticated()
                    .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 ->
                    oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000","http://10.0.2.2:8080"));
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
