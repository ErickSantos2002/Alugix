package com.alugix.dto.response;

import com.alugix.enums.StatusImovel;
import com.alugix.enums.TipoImovel;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ImovelResponseDTO(
        Long id,
        String nome,
        String endereco,
        String cep,
        String cidade,
        String estado,
        TipoImovel tipo,
        Integer quartos,
        Integer banheiros,
        BigDecimal areaM2,
        BigDecimal valorAluguel,
        StatusImovel status,
        String descricao,
        LocalDateTime createdAt
) {}
