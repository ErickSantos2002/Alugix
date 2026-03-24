package com.alugix.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InquilinoResponseDTO(
        Long id,
        String nome,
        String cpf,
        String telefone,
        String email,
        BigDecimal rendaMensal,
        String status,
        Boolean ativo,
        LocalDateTime createdAt
) {}
