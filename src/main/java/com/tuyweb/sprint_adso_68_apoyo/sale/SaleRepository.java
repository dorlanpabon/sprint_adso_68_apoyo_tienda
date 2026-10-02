package com.tuyweb.sprint_adso_68_apoyo.sale;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByClienteEmailOrderByFechaDesc(String email);
    List<Sale> findAllByOrderByFechaDesc();
}
