package com.tuyweb.sprint_adso_68_apoyo.store;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNombre(String nombre);
}
