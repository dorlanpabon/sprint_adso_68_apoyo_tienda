package com.tuyweb.sprint_adso_68_apoyo.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String apellido;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    private Boolean enabled;

    /**
     * Roles a asignar. Solo ADMIN usa este endpoint, por lo que se permite
     * cualquier rol existente: ROLE_ADMIN, ROLE_VENDEDOR, ROLE_CLIENTE.
     * Si es null/vacío se asigna ROLE_CLIENTE.
     */
    private Set<String> roles;
}
