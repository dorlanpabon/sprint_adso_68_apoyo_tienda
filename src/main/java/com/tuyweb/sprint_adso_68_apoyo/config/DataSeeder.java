package com.tuyweb.sprint_adso_68_apoyo.config;

import com.tuyweb.sprint_adso_68_apoyo.user.Role;
import com.tuyweb.sprint_adso_68_apoyo.user.RoleRepository;
import com.tuyweb.sprint_adso_68_apoyo.user.User;
import com.tuyweb.sprint_adso_68_apoyo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seed(UserRepository users, RoleRepository roles) {
        return args -> {
            Role admin = roles.findByName("ROLE_ADMIN")
                    .orElseGet(() -> roles.save(Role.builder().name("ROLE_ADMIN").build()));
            Role vendedor = roles.findByName("ROLE_VENDEDOR")
                    .orElseGet(() -> roles.save(Role.builder().name("ROLE_VENDEDOR").build()));
            Role cliente = roles.findByName("ROLE_CLIENTE")
                    .orElseGet(() -> roles.save(Role.builder().name("ROLE_CLIENTE").build()));

            users.findByEmail("admin@sistema.com").orElseGet(() -> users.save(User.builder()
                    .nombre("Admin")
                    .apellido("Sistema")
                    .email("admin@sistema.com")
                    .password(passwordEncoder.encode("Admin123*"))
                    .enabled(true)
                    .roles(Set.of(admin, vendedor, cliente))
                    .build()));
        };
    }
}
