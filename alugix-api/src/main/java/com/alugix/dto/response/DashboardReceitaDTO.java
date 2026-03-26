package com.alugix.dto.response;

import java.math.BigDecimal;

public record DashboardReceitaDTO(
        int mes,
        int ano,
        BigDecimal receitaPrevista,
        BigDecimal receitaRealizada,
        long pagamentosPagos,
        long pagamentosPendentes,
        long pagamentosAtrasados
) {}
