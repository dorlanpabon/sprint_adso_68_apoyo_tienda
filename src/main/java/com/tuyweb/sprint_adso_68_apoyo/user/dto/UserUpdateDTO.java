package com.tuyweb.sprint_adso_68_apoyo.user.dto;

import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {

    private String nombre;
    private String apellido;
    private Boolean enabled;

    /**
     * Si se envía, reemplaza los roles del usuario.
     * Solo ADMIN usa este endpoint.
     */
    private Set<String> roles;

    /**
     * Si se envía (no blank), se re-hashea y reemplaza la contraseña.
     * Si es null/blank, se conserva la actual.
     */
    private String password;
}
