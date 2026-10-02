package com.tuyweb.sprint_adso_68_apoyo.store;

import com.tuyweb.sprint_adso_68_apoyo.store.dto.CategoryDTO;
import com.tuyweb.sprint_adso_68_apoyo.store.dto.ProductRequestDTO;
import com.tuyweb.sprint_adso_68_apoyo.store.dto.ProductResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    /** Catálogo: cualquier autenticado (tienda cliente). */
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> list(@RequestParam(defaultValue = "true") boolean soloActivos) {
        return ResponseEntity.ok(productService.findAll(soloActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    /** Solo ADMIN crea/edita. VENDEDOR solo vende, CLIENTE solo compra. */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> create(@Valid @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
