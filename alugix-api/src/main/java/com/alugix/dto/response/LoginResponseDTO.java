package com.alugix.dto.response;

import lombok.Builder;

@Builder
public record LoginResponseDTO(
        String token,
        String tipo,
        long expiresIn,
        String nome,
        String perfil
) {}
