package com.tuyweb.sprint_adso_68_apoyo.user;

import com.tuyweb.sprint_adso_68_apoyo.security.JwtService;
import com.tuyweb.sprint_adso_68_apoyo.user.dto.AuthResponse;
import com.tuyweb.sprint_adso_68_apoyo.user.dto.LoginRequest;
import com.tuyweb.sprint_adso_68_apoyo.user.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Set<String> PUBLIC_ROLES = Set.of("ROLE_VENDEDOR", "ROLE_CLIENTE");

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final com.tuyweb.sprint_adso_68_apoyo.security.CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        String roleName = normalizePublicRole(req.getRol());

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Rol no configurado: " + roleName));

        User user = User.builder()
                .nombre(req.getNombre())
                .apellido(req.getApellido())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .enabled(true)
                .roles(Set.of(role))
                .build();
        userRepository.save(user);

        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(details);
        return toResponse(user, token);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(details);
        return toResponse(user, token);
    }

    private String normalizePublicRole(String raw) {
        if (raw == null || raw.isBlank()) {
            return "ROLE_CLIENTE"; // default público
        }
        String normalized = raw.trim().toUpperCase();
        if (!normalized.startsWith("ROLE_")) {
            normalized = "ROLE_" + normalized;
        }
        if (!PUBLIC_ROLES.contains(normalized)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Rol no permitido en registro público. Use VENDEDOR o CLIENTE");
        }
        return normalized;
    }

    private AuthResponse toResponse(User user, String token) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(user.getEmail())
                .nombre(user.getNombre())
                .roles(roles)
                .build();
    }
}
