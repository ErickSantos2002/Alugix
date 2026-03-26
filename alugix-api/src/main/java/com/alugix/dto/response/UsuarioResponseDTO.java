package com.alugix.dto.response;

import com.alugix.enums.Perfil;

import java.time.LocalDateTime;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        Perfil perfil,
        Boolean ativo,
        LocalDateTime createdAt
) {}
