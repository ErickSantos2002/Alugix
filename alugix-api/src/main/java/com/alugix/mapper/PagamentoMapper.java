package com.alugix.mapper;

import com.alugix.dto.response.PagamentoResponseDTO;
import com.alugix.entity.Pagamento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PagamentoMapper {

    @Mapping(target = "contratoId", source = "contrato.id")
    PagamentoResponseDTO toResponse(Pagamento pagamento);
}
