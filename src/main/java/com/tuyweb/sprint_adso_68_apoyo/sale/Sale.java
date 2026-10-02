package com.tuyweb.sprint_adso_68_apoyo.sale;

import com.tuyweb.sprint_adso_68_apoyo.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private User cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendedor_id")
    private User vendedor;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SaleStatus estado = SaleStatus.PAGADA;

    /** Método usado: EFECTIVO, TARJETA, TRANSFERENCIA... Placeholder sin pasarela real. */
    @Column(length = 50)
    @Builder.Default
    private String paymentMethod = "EFECTIVO";

    /** Referencia de la pasarela. Con mock es MOCK-xxx. */
    @Column(length = 100)
    private String paymentRef;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<SaleItem> items = new ArrayList<>();
}
