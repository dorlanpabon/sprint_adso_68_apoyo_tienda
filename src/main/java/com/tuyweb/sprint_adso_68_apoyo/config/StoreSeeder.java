package com.tuyweb.sprint_adso_68_apoyo.config;

import com.tuyweb.sprint_adso_68_apoyo.store.Category;
import com.tuyweb.sprint_adso_68_apoyo.store.CategoryRepository;
import com.tuyweb.sprint_adso_68_apoyo.store.Product;
import com.tuyweb.sprint_adso_68_apoyo.store.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class StoreSeeder {

    @Bean
    @Order(2)
    CommandLineRunner seedStore(CategoryRepository categories, ProductRepository products) {
        return args -> {
            if (categories.count() == 0) {
                categories.saveAll(List.of(
                        Category.builder().nombre("General").descripcion("Varios").build(),
                        Category.builder().nombre("Electrónica").descripcion("Dispositivos y accesorios").build(),
                        Category.builder().nombre("Ropa").descripcion("Vestuario").build()
                ));
            }
            if (products.count() == 0) {
                Category general = categories.findAll().stream().findFirst().orElseThrow();
                products.saveAll(List.of(
                        Product.builder().nombre("Mouse inalámbrico").descripcion("Mouse óptico 2.4GHz")
                                .precio(new BigDecimal("45000")).stock(50).activo(true).categoria(general).build(),
                        Product.builder().nombre("Camiseta básica").descripcion("Algodón talla M")
                                .precio(new BigDecimal("35000")).stock(100).activo(true).categoria(general).build(),
                        Product.builder().nombre("Audífonos bluetooth").descripcion("Con micrófono")
                                .precio(new BigDecimal("120000")).stock(30).activo(true).categoria(general).build()
                ));
            }
        };
    }
}
