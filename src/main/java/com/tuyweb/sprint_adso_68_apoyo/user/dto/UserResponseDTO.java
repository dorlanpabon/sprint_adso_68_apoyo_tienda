package com.tuyweb.sprint_adso_68_apoyo.user.dto;

import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private boolean enabled;
    private Set<String> roles;
}
