package com.tuyweb.sprint_adso_68_apoyo.sale.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequest {
    @NotEmpty(message = "El carrito está vacío")
    private List<Item> items;

    /**
     * Solo VENDEDOR/ADMIN pueden vender a otro cliente indicando su email.
     * CLIENTE: se ignora y se usa su propio email.
     */
    private String clienteEmail;

    /** EFECTIVO, TARJETA, TRANSFERENCIA... placeholder. */
    private String paymentMethod;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Item {
        @NotNull
        private Long productId;
        @NotNull
        @Min(value = 1, message = "Cantidad mínima 1")
        private Integer cantidad;
    }
}
