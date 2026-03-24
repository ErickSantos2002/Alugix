package com.alugix.dto.request;

import com.alugix.enums.StatusImovel;
import com.alugix.enums.TipoImovel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ImovelRequestDTO(

        @NotBlank
        @Size(max = 150)
        @Schema(description = "Nome/apelido do imóvel", example = "Apto Centro")
        String nome,

        @NotBlank
        @Size(max = 300)
        @Schema(description = "Endereço completo", example = "Rua das Flores, 123, Apto 45")
        String endereco,

        @NotBlank
        @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP inválido")
        @Schema(description = "CEP", example = "01310-100")
        String cep,

        @NotBlank
        @Size(max = 100)
        @Schema(description = "Cidade", example = "São Paulo")
        String cidade,

        @NotBlank
        @Size(min = 2, max = 2, message = "Estado deve ter 2 letras")
        @Schema(description = "Estado (sigla)", example = "SP")
        String estado,

        @NotNull
        @Schema(description = "Tipo do imóvel")
        TipoImovel tipo,

        @NotNull
        @Min(0)
        @Schema(description = "Número de quartos", example = "2")
        Integer quartos,

        @NotNull
        @Min(0)
        @Schema(description = "Número de banheiros", example = "1")
        Integer banheiros,

        @DecimalMin(value = "0.01", message = "Área deve ser maior que zero")
        @Schema(description = "Área em m²", example = "65.50")
        BigDecimal areaM2,

        @NotNull
        @DecimalMin(value = "0.01", message = "Valor do aluguel deve ser maior que zero")
        @Schema(description = "Valor do aluguel", example = "1500.00")
        BigDecimal valorAluguel,

        @Size(max = 1000)
        @Schema(description = "Descrição", example = "Apartamento bem localizado com varanda")
        String descricao,

        @Schema(description = "Status do imóvel (apenas para edição)", example = "MANUTENCAO")
        StatusImovel status
) {}
