package com.alugix.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PagamentoRequestDTO(

        @NotNull
        @DecimalMin(value = "0.01", message = "Valor pago deve ser maior que zero")
        @Schema(description = "Valor efetivamente pago", example = "1500.00")
        BigDecimal valorPago,

        @NotNull
        @Schema(description = "Data em que o pagamento foi realizado", example = "2026-04-10")
        LocalDate dataPagamento,

        @Schema(description = "Forma de pagamento", example = "PIX")
        String formaPagamento,

        @Schema(description = "Observações", example = "Pago com desconto de multa")
        String observacoes
) {}
