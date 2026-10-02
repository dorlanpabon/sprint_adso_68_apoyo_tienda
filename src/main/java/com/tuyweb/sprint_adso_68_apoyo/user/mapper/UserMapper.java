package com.tuyweb.sprint_adso_68_apoyo.user.mapper;

import com.tuyweb.sprint_adso_68_apoyo.user.Role;
import com.tuyweb.sprint_adso_68_apoyo.user.User;
import com.tuyweb.sprint_adso_68_apoyo.user.dto.UserCreateDTO;
import com.tuyweb.sprint_adso_68_apoyo.user.dto.UserResponseDTO;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", source = "roles", qualifiedByName = "rolesToNames")
    UserResponseDTO toResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    User toEntity(UserCreateDTO dto);

    @Named("rolesToNames")
    default Set<String> rolesToNames(Set<Role> roles) {
        if (roles == null) return Set.of();
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
}
