package WebThuePhongTro.WebThuePhongTro;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum Role {
    ROLE_ADMIN(1),
    ROLE_EMPLOYEE(2),
    ROLE_USER(3);
    public final int value;
}
