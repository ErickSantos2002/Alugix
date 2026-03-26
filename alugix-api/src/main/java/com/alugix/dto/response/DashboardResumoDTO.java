package com.alugix.dto.response;

public record DashboardResumoDTO(
        long totalImoveis,
        long imoveisDisponiveis,
        long imoveisAlugados,
        long imoveisManutencao,
        long totalInquilinos,
        long totalContratosAtivos,
        long totalPagamentosAtrasados
) {}
