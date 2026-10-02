package com.tuyweb.sprint_adso_68_apoyo.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String apellido;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    /**
     * Rol público permitido: VENDEDOR o CLIENTE (con o sin prefijo ROLE_).
     * Si es null/vacío se asigna ROLE_CLIENTE.
     * ROLE_ADMIN NO está permitido aquí.
     */
    private String rol;
}
