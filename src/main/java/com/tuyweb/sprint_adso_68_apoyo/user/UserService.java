package com.tuyweb.sprint_adso_68_apoyo.user;

import com.tuyweb.sprint_adso_68_apoyo.user.dto.UserCreateDTO;
import com.tuyweb.sprint_adso_68_apoyo.user.dto.UserResponseDTO;
import com.tuyweb.sprint_adso_68_apoyo.user.dto.UserUpdateDTO;
import com.tuyweb.sprint_adso_68_apoyo.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponseDTO findById(Long id) {
        return userMapper.toResponse(getEntityOrThrow(id));
    }

    public UserResponseDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponseDTO create(UserCreateDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEnabled(dto.getEnabled() == null || dto.getEnabled());
        user.setRoles(resolveRoles(dto.getRoles()));
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO update(Long id, UserUpdateDTO dto) {
        User user = getEntityOrThrow(id);

        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            user.setNombre(dto.getNombre());
        }
        if (dto.getApellido() != null) {
            user.setApellido(dto.getApellido());
        }
        if (dto.getEnabled() != null) {
            user.setEnabled(dto.getEnabled());
        }
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            if (dto.getPassword().length() < 8) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe tener al menos 8 caracteres");
            }
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        if (dto.getRoles() != null) {
            user.setRoles(resolveRoles(dto.getRoles()));
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    /**
     * Baja lógica: desactiva el usuario en vez de borrarlo.
     */
    @Transactional
    public void delete(Long id) {
        User user = getEntityOrThrow(id);
        user.setEnabled(false);
        userRepository.save(user);
    }

    private User getEntityOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado: " + id));
    }

    private Set<Role> resolveRoles(Set<String> names) {
        if (names == null || names.isEmpty()) {
            Role def = roleRepository.findByName("ROLE_CLIENTE")
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Rol ROLE_CLIENTE no configurado"));
            return Set.of(def);
        }
        return names.stream()
                .map(n -> {
                    String normalized = n.trim().toUpperCase();
                    if (!normalized.startsWith("ROLE_")) normalized = "ROLE_" + normalized;
                    return roleRepository.findByName(normalized)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol inexistente: " + n));
                })
                .collect(Collectors.toSet());
    }
}
