package WebThuePhongTro.WebThuePhongTro.Validator;

import WebThuePhongTro.WebThuePhongTro.Model.User;
import WebThuePhongTro.WebThuePhongTro.Repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UniqueValidator implements ConstraintValidator<Unique, String> {

    private final UserRepository userRepository;

    public UniqueValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void initialize(Unique constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {

        final String PHONE_PATTERN = "[0][0-9]*$";
        Pattern pattern = Pattern.compile(PHONE_PATTERN);
        Matcher matcher =pattern.matcher(s);
        Optional<User> existingUser;
        if(matcher.matches())
            existingUser = userRepository.findByPhoneNumber(s);
        else if (s.contains("@")) {
            existingUser = userRepository.findByEmail(s);
        }
        else
            existingUser = userRepository.findByUserName(s);

        if(existingUser.isPresent()){
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();
            if(!userName.equals("anonymousUser"))
            {
                User userLogin = userRepository.findByUserName(userName).orElseThrow();
                return existingUser.get().getUserId() == userLogin.getUserId();
            }
            return false;
        }
        return true;



    }

}