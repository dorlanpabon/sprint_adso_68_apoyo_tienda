package com.tuyweb.sprint_adso_68_apoyo.sale;

import com.tuyweb.sprint_adso_68_apoyo.sale.dto.CheckoutRequest;
import com.tuyweb.sprint_adso_68_apoyo.sale.dto.SaleResponseDTO;
import com.tuyweb.sprint_adso_68_apoyo.sale.payment.PaymentGateway;
import com.tuyweb.sprint_adso_68_apoyo.store.Product;
import com.tuyweb.sprint_adso_68_apoyo.store.ProductRepository;
import com.tuyweb.sprint_adso_68_apoyo.user.User;
import com.tuyweb.sprint_adso_68_apoyo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PaymentGateway paymentGateway;

    private boolean isSeller(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_VENDEDOR") || a.getAuthority().equals("ROLE_ADMIN"));
    }

    @Transactional
    public SaleResponseDTO checkout(CheckoutRequest req, Authentication auth) {
        String requesterEmail = auth.getName();
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));

        // CLIENTE compra para sí. VENDEDOR/ADMIN puede vender a otro cliente.
        User cliente = requester;
        User vendedor = null;
        if (req.getClienteEmail() != null && !req.getClienteEmail().isBlank()
                && !req.getClienteEmail().equalsIgnoreCase(requesterEmail)) {
            if (!isSeller(auth)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo VENDEDOR/ADMIN puede vender a otro cliente");
            }
            cliente = userRepository.findByEmail(req.getClienteEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente no existe: " + req.getClienteEmail()));
            vendedor = requester;
        }

        String method = (req.getPaymentMethod() == null || req.getPaymentMethod().isBlank())
                ? "EFECTIVO" : req.getPaymentMethod().trim().toUpperCase();

        Sale sale = Sale.builder()
                .cliente(cliente).vendedor(vendedor)
                .fecha(LocalDateTime.now())
                .total(BigDecimal.ZERO)
                .estado(SaleStatus.CREADA)
                .paymentMethod(method)
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CheckoutRequest.Item item : req.getItems()) {
            Product p = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto inexistente: " + item.getProductId()));
            if (!p.isActivo()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto inactivo: " + p.getNombre());
            if (p.getStock() < item.getCantidad()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Stock insuficiente para " + p.getNombre() + " (disponible " + p.getStock() + ")");
            }
            p.setStock(p.getStock() - item.getCantidad());
            productRepository.save(p);

            BigDecimal sub = p.getPrecio().multiply(BigDecimal.valueOf(item.getCantidad()));
            SaleItem si = SaleItem.builder()
                    .sale(sale).producto(p).cantidad(item.getCantidad())
                    .precioUnitario(p.getPrecio()).subtotal(sub).build();
            sale.getItems().add(si);
            total = total.add(sub);
        }
        if (sale.getItems().isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Venta vacía");
        sale.setTotal(total);

        // Pasarela (mock por ahora, deja la implementación para la real).
        var pay = paymentGateway.charge(total, method);
        if (!pay.approved()) throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Pago rechazado: " + pay.message());
        sale.setPaymentRef(pay.reference());
        sale.setEstado(SaleStatus.PAGADA);

        return toDTO(saleRepository.save(sale));
    }

    public List<SaleResponseDTO> mine(String email) {
        return saleRepository.findByClienteEmailOrderByFechaDesc(email).stream().map(this::toDTO).toList();
    }

    public List<SaleResponseDTO> findAll() {
        return saleRepository.findAllByOrderByFechaDesc().stream().map(this::toDTO).toList();
    }

    @Transactional
    public SaleResponseDTO cancel(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada"));
        if (sale.getEstado() == SaleStatus.CANCELADA) return toDTO(sale);
        // Devuelve stock
        for (SaleItem item : sale.getItems()) {
            Product p = item.getProducto();
            p.setStock(p.getStock() + item.getCantidad());
            productRepository.save(p);
        }
        sale.setEstado(SaleStatus.CANCELADA);
        return toDTO(saleRepository.save(sale));
    }

    private SaleResponseDTO toDTO(Sale s) {
        return SaleResponseDTO.builder()
                .id(s.getId())
                .clienteEmail(s.getCliente().getEmail())
                .vendedorEmail(s.getVendedor() != null ? s.getVendedor().getEmail() : null)
                .fecha(s.getFecha()).total(s.getTotal())
                .estado(s.getEstado().name())
                .paymentMethod(s.getPaymentMethod()).paymentRef(s.getPaymentRef())
                .items(s.getItems().stream().map(i -> SaleResponseDTO.SaleItemDTO.builder()
                        .productId(i.getProducto().getId())
                        .productNombre(i.getProducto().getNombre())
                        .cantidad(i.getCantidad())
                        .precioUnitario(i.getPrecioUnitario())
                        .subtotal(i.getSubtotal()).build()).toList())
                .build();
    }
}
