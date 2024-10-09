package WebThuePhongTro.WebThuePhongTro.Exception;

import WebThuePhongTro.WebThuePhongTro.DTO.Response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<?> handlingRuntimeException(RuntimeException exception){
        return ResponseEntity.badRequest().body(ApiResponse.builder().build());
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<?> handlingAppException(AppException exception){
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .success(false)
                .time(LocalDateTime.now())
                .error(exception.getMessage())
                .build());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<?> handlingMethodArgumentNotValidException(MethodArgumentNotValidException exception){

        List<String> errors = exception.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .toList();
        return ResponseEntity.badRequest().body(
                ApiResponse.builder()
                        .success(false)
                        .time(LocalDateTime.now())
                        .error(errors)
                .build());
    }
}
