package WebThuePhongTro.WebThuePhongTro.Repository;

import WebThuePhongTro.WebThuePhongTro.Model.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface InvoiceRepository extends JpaRepository<Invoice,Integer> {

    Page<Invoice> findByUser_UserName(String userName, Pageable pageable);

    Page<Invoice> findByUser_UserNameAndService_ServiceName(String userName, String serviceName, Pageable pageable);

    Page<Invoice> findByUser_UserNameAndService_ServiceNameNot(String userName, String serviceName, Pageable pageable);

    Page<Invoice> Service_ServiceName(String serviceName, Pageable pageable);

    Page<Invoice> Service_ServiceNameNot(String serviceName, Pageable pageable);
}
