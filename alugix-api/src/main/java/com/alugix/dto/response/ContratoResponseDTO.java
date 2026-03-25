package com.alugix.dto.response;

import com.alugix.enums.StatusContrato;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ContratoResponseDTO(
        Long id,
        ImovelResumoDTO imovel,
        InquilinoResumoDTO inquilino,
        BigDecimal valorAluguel,
        LocalDate dataInicio,
        LocalDate dataTermino,
        Integer diaVencimento,
        StatusContrato status,
        String observacoes,
        LocalDateTime createdAt
) {
    public record ImovelResumoDTO(Long id, String nome, String endereco, String tipo) {}
    public record InquilinoResumoDTO(Long id, String nome, String cpf) {}
}
