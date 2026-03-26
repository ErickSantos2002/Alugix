package com.alugix.dto.response;

import com.alugix.enums.StatusPagamento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PagamentoResponseDTO(
        Long id,
        Long contratoId,
        LocalDate mesReferencia,
        LocalDate dataVencimento,
        LocalDate dataPagamento,
        BigDecimal valorPago,
        StatusPagamento status,
        String formaPagamento,
        String observacoes,
        LocalDateTime createdAt
) {}
