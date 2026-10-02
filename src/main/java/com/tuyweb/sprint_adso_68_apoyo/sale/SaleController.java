package com.tuyweb.sprint_adso_68_apoyo.sale;

import com.tuyweb.sprint_adso_68_apoyo.sale.dto.CheckoutRequest;
import com.tuyweb.sprint_adso_68_apoyo.sale.dto.SaleResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {
    private final SaleService saleService;

    /** CLIENTE compra, VENDEDOR vende (a sí mismo o a clienteEmail). */
    @PostMapping("/checkout")
    @PreAuthorize("hasAnyRole('CLIENTE','VENDEDOR','ADMIN')")
    public ResponseEntity<SaleResponseDTO> checkout(@Valid @RequestBody CheckoutRequest req, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(saleService.checkout(req, auth));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SaleResponseDTO>> mine(Authentication auth) {
        return ResponseEntity.ok(saleService.mine(auth.getName()));
    }

    /** VENDEDOR y ADMIN ven todas las ventas. */
    @GetMapping
    @PreAuthorize("hasAnyRole('VENDEDOR','ADMIN')")
    public ResponseEntity<List<SaleResponseDTO>> all() {
        return ResponseEntity.ok(saleService.findAll());
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('VENDEDOR','ADMIN')")
    public ResponseEntity<SaleResponseDTO> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.cancel(id));
    }
}
