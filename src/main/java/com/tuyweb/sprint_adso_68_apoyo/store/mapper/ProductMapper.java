package com.tuyweb.sprint_adso_68_apoyo.store.mapper;

import com.tuyweb.sprint_adso_68_apoyo.store.Product;
import com.tuyweb.sprint_adso_68_apoyo.store.dto.ProductRequestDTO;
import com.tuyweb.sprint_adso_68_apoyo.store.dto.ProductResponseDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "categoriaNombre", source = "categoria.nombre")
    ProductResponseDTO toResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    Product toEntity(ProductRequestDTO dto);
}
