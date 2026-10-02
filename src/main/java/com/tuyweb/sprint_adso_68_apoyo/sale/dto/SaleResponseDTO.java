package com.tuyweb.sprint_adso_68_apoyo.sale.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleResponseDTO {
    private Long id;
    private String clienteEmail;
    private String vendedorEmail;
    private LocalDateTime fecha;
    private BigDecimal total;
    private String estado;
    private String paymentMethod;
    private String paymentRef;
    private List<SaleItemDTO> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SaleItemDTO {
        private Long productId;
        private String productNombre;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
    }
}
