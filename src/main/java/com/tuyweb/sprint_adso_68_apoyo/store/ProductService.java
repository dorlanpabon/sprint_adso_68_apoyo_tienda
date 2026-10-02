package com.tuyweb.sprint_adso_68_apoyo.store;

import com.tuyweb.sprint_adso_68_apoyo.store.dto.ProductRequestDTO;
import com.tuyweb.sprint_adso_68_apoyo.store.dto.ProductResponseDTO;
import com.tuyweb.sprint_adso_68_apoyo.store.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper mapper;

    public List<ProductResponseDTO> findAll(boolean soloActivos) {
        List<Product> list = soloActivos
                ? productRepository.findByActivoTrueOrderByIdDesc()
                : productRepository.findAllByOrderByIdDesc();
        return list.stream().map(mapper::toResponse).toList();
    }

    public ProductResponseDTO findById(Long id) {
        return mapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public ProductResponseDTO create(ProductRequestDTO dto) {
        Product p = mapper.toEntity(dto);
        p.setActivo(dto.getActivo() == null || dto.getActivo());
        p.setCategoria(resolveCategoria(dto.getCategoriaId()));
        return mapper.toResponse(productRepository.save(p));
    }

    @Transactional
    public ProductResponseDTO update(Long id, ProductRequestDTO dto) {
        Product p = getOrThrow(id);
        if (dto.getNombre() != null && !dto.getNombre().isBlank()) p.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) p.setDescripcion(dto.getDescripcion());
        if (dto.getPrecio() != null) p.setPrecio(dto.getPrecio());
        if (dto.getStock() != null) {
            if (dto.getStock() < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock inválido");
            p.setStock(dto.getStock());
        }
        if (dto.getImagenUrl() != null) p.setImagenUrl(dto.getImagenUrl());
        if (dto.getActivo() != null) p.setActivo(dto.getActivo());
        if (dto.getCategoriaId() != null) p.setCategoria(resolveCategoria(dto.getCategoriaId()));
        return mapper.toResponse(productRepository.save(p));
    }

    @Transactional
    public void deactivate(Long id) {
        Product p = getOrThrow(id);
        p.setActivo(false);
        productRepository.save(p);
    }

    private Product getOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado: " + id));
    }

    private Category resolveCategoria(Long categoriaId) {
        if (categoriaId == null) return null;
        return categoryRepository.findById(categoriaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría inexistente"));
    }
}
