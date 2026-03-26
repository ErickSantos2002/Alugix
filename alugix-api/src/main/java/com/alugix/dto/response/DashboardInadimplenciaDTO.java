package com.alugix.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DashboardInadimplenciaDTO(
        long total,
        BigDecimal valorTotalAtrasado,
        List<PagamentoAtrasadoDTO> pagamentos
) {
    public record PagamentoAtrasadoDTO(
            Long pagamentoId,
            Long contratoId,
            String nomeInquilino,
            String nomeImovel,
            LocalDate mesReferencia,
            LocalDate dataVencimento,
            BigDecimal valorAluguel,
            long diasAtraso
    ) {}
}
