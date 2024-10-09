package WebThuePhongTro.WebThuePhongTro.Service;

import WebThuePhongTro.WebThuePhongTro.DTO.Request.AuthenticationLoginRequest;
import WebThuePhongTro.WebThuePhongTro.DTO.Response.AuthenticationResponse;
import WebThuePhongTro.WebThuePhongTro.Exception.AppException;
import WebThuePhongTro.WebThuePhongTro.Exception.ErrorCode;
import WebThuePhongTro.WebThuePhongTro.Model.Role;
import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.UserPostRepository;
import WebThuePhongTro.WebThuePhongTro.Repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;

    private final UserPostRepository userPostRepository;

    @Value("${jwt.secretKey}")
    private String secretKey;

    public AuthenticationResponse login(AuthenticationLoginRequest authenticationRequest) throws JOSEException {

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User user;
        if(authenticationRequest.getUserName().contains("@")){
            user = userRepository.findByEmail(authenticationRequest.getUserName())
                    .orElseThrow(()->new AppException(ErrorCode.ERROR_USER_LOGIN));
        }
        else{
            user = userRepository.findByUserName(authenticationRequest.getUserName())
                    .orElseThrow(()->new AppException(ErrorCode.ERROR_USER_LOGIN));
        }


        boolean auth = passwordEncoder.matches(authenticationRequest.getPassword(),user.getPassword());

        if(!auth)
            throw new AppException(ErrorCode.ERROR_USER_LOGIN);

        String token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .userName(user.getUsername())
                .avatar(user.getAvatar())
                .likePost(userPostRepository.getLikePostOfUser(user.getUserId())
                                    .stream().map(PostService::convertToDTO).toList())
                .build();
    }

    public AuthenticationResponse refreshToken(String tokenAuth) throws JOSEException, ParseException {

        if(validateToken(tokenAuth)){
            SignedJWT signedJWT = SignedJWT.parse(tokenAuth);
            String userName = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository.findByUserName(userName).orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXIST));
            String token = generateToken(user);
            return AuthenticationResponse.builder()
                    .token(token)
                    .userName(user.getUsername())
                    .avatar(user.getAvatar())
                    .likePost(userPostRepository.getLikePostOfUser(user.getUserId())
                            .stream().map(PostService::convertToDTO).toList())
                    .build();
        }
        return null;
    }


    public AuthenticationResponse update(User user) throws JOSEException {

        String token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .userName(user.getUsername())
                .avatar(user.getAvatar())
                .likePost(userPostRepository.getLikePostOfUser(user.getUserId())
                        .stream().map(PostService::convertToDTO).toList())
                .build();
    }


    private String generateToken(User user) throws JOSEException {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS256);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                                    .subject(user.getUsername())
                                    .issuer("tro24h.com")
                                    .issueTime(new Date())
                                    .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                                    .claim("scope",user.getRoles().stream().map(Role::getRoleName).collect(Collectors.joining()))
                                    .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader,payload);

        jwsObject.sign(new MACSigner(secretKey.getBytes()));

        return jwsObject.serialize();
    }

    public boolean validateToken(String token) throws JOSEException, ParseException {
        JWSVerifier jwsVerifier = new MACVerifier(secretKey.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verifier = signedJWT.verify(jwsVerifier);

        return verifier && expirationTime.after(new Date());
    }

    public String getUserName(HttpServletRequest request) throws JOSEException, ParseException {
        String authorizationHeader = request.getHeader("Authorization");
        String token = authorizationHeader.substring(7);
        if(validateToken(token)) {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        }
        return null;
    }
}
