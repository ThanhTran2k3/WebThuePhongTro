package WebThuePhongTro.WebThuePhongTro.Model;

import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
public class UserPostId implements Serializable {

    private int user;
    private int post;
}
