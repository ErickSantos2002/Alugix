package com.alugix.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratoRequestDTO(

        @NotNull
        @Schema(description = "ID do imóvel", example = "1")
        Long imovelId,

        @NotNull
        @Schema(description = "ID do inquilino", example = "1")
        Long inquilinoId,

        @NotNull
        @DecimalMin(value = "0.01", message = "Valor do aluguel deve ser maior que zero")
        @Schema(description = "Valor mensal do aluguel", example = "1500.00")
        BigDecimal valorAluguel,

        @NotNull
        @Schema(description = "Data de início do contrato", example = "2026-04-01")
        LocalDate dataInicio,

        @NotNull
        @Schema(description = "Data de término do contrato", example = "2027-03-31")
        LocalDate dataTermino,

        @NotNull
        @Min(value = 1, message = "Dia de vencimento deve ser entre 1 e 31")
        @Max(value = 31, message = "Dia de vencimento deve ser entre 1 e 31")
        @Schema(description = "Dia do mês para vencimento do aluguel", example = "10")
        Integer diaVencimento,

        @Schema(description = "Observações", example = "Contrato com reajuste anual pelo IGPM")
        String observacoes
) {}
