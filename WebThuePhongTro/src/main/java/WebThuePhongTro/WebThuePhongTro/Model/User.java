package WebThuePhongTro.WebThuePhongTro.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    private String avatar;

    @Column(nullable = false, unique = true,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Tên người dùng không được bỏ trống")
/*    @Unique(message = "Username đã được dùng")*/
    @Size(min = 5, max = 50, message = "UserName từ 5 đến 50 ký tự")
    private String userName;

    @Column(columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min =5 , message = "Họ và tên ít nhất 5 ký tự")
    private String fullName;

    @NotNull(message = "Ngày sinh không được bỏ trống")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private LocalDate birthDate;

    @Column(unique = true,nullable = false,columnDefinition = "nvarchar(255)")
    @Size(min = 10, max = 10, message = "Số điện thoại phải có 10 số")
    @Pattern(regexp = "[0][0-9]*$", message = "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số")
/*    @Unique(message = "Số điện thoại đã tồn tại")*/
    private String phoneNumber;

    @Column(unique = true,nullable = false,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Email không được bỏ trống")
    @Size(min = 1, max = 50, message = "Email không quá 50 ký tự")
/*    @Unique(message = "Email đã tồn tại")*/
    @Email(message = "Email không hợp lệ")
    private String email;

    @Column(columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Tỉnh thành không được để trống")
    private String city ;

    @Column(columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Quận huyện không được để trống")
    private String district;

    @Column(columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Phường xã không được để trống")
    private String wards;

    @Column(columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @Column(nullable = false,columnDefinition = "nvarchar(255)")
    @NotBlank(message = "Password không được bỏ trống")
    @Pattern(regexp = "^[A-Z].*(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$",message = "Password bắt đầu bằng chữ hoa, có 1 số và 1 kí tự đặc biệt")
    @Size(min = 8, message = "Password phải từ 8 ký tự")
    private String password;


    private BigDecimal balance;

    private boolean status;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime joinDate;

    @OneToMany(mappedBy = "user")
    private Set<Invoice> users;

    @OneToMany(mappedBy = "user")
    private Set<UserPost> userPosts;

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private Set<Message> sentMessages;

    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY)
    private Set<Message> receivedMessages;

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(name = "User_Role",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "roleId"))
    private Set<Role> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
