package com.alugix.dto.request;

import com.alugix.enums.StatusImovel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record ImovelStatusRequestDTO(

        @NotNull
        @Schema(description = "Novo status do imóvel (DISPONIVEL ou MANUTENCAO)", example = "MANUTENCAO")
        StatusImovel status
) {}
