package WebThuePhongTro.WebThuePhongTro.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;


@OpenAPIDefinition(info = @Info(title = "API Documentation", version = "1.0"))
@SecurityScheme(name = "Token", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class SwaggerConfig{

}
