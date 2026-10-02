package com.tuyweb.sprint_adso_68_apoyo.store;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActivoTrueOrderByIdDesc();
    List<Product> findAllByOrderByIdDesc();
}
