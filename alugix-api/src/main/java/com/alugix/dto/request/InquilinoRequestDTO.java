package com.alugix.dto.request;

import com.alugix.util.Cpf;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record InquilinoRequestDTO(

        @NotBlank
        @Size(max = 200)
        @Schema(description = "Nome completo do inquilino", example = "João da Silva")
        String nome,

        @NotBlank
        @Cpf
        @Schema(description = "CPF (com ou sem formatação)", example = "123.456.789-09")
        String cpf,

        @NotBlank
        @Size(max = 20)
        @Schema(description = "Telefone", example = "(11) 99999-9999")
        String telefone,

        @Email
        @Size(max = 200)
        @Schema(description = "E-mail", example = "joao@email.com")
        String email,

        @DecimalMin(value = "0.01", message = "Renda mensal deve ser maior que zero")
        @Schema(description = "Renda mensal", example = "3500.00")
        BigDecimal rendaMensal
) {}
