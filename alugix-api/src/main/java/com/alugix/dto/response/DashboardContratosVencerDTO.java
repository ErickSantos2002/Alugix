package com.alugix.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DashboardContratosVencerDTO(
        long total,
        List<ContratoVencendoDTO> contratos
) {
    public record ContratoVencendoDTO(
            Long contratoId,
            String nomeInquilino,
            String nomeImovel,
            LocalDate dataTermino,
            long diasRestantes,
            BigDecimal valorAluguel
    ) {}
}
