package WebThuePhongTro.WebThuePhongTro.Validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueValidator.class)
public @interface Unique {
    String message() default "User already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}


