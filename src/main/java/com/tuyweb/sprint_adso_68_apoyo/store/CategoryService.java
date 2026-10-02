package com.tuyweb.sprint_adso_68_apoyo.store;

import com.tuyweb.sprint_adso_68_apoyo.store.dto.CategoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repository;

    public List<CategoryDTO> findAll() {
        return repository.findAll().stream()
                .map(c -> CategoryDTO.builder().id(c.getId()).nombre(c.getNombre()).descripcion(c.getDescripcion()).build())
                .toList();
    }

    @Transactional
    public CategoryDTO create(CategoryDTO dto) {
        if (repository.existsByNombre(dto.getNombre())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La categoría ya existe");
        }
        Category saved = repository.save(Category.builder()
                .nombre(dto.getNombre()).descripcion(dto.getDescripcion()).build());
        dto.setId(saved.getId());
        return dto;
    }
}
