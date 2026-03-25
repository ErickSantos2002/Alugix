package com.alugix.mapper;

import com.alugix.dto.response.ContratoResponseDTO;
import com.alugix.entity.Contrato;
import com.alugix.entity.Imovel;
import com.alugix.entity.Inquilino;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContratoMapper {

    @Mapping(target = "imovel", expression = "java(toImovelResumo(contrato.getImovel()))")
    @Mapping(target = "inquilino", expression = "java(toInquilinoResumo(contrato.getInquilino()))")
    ContratoResponseDTO toResponse(Contrato contrato);

    default ContratoResponseDTO.ImovelResumoDTO toImovelResumo(Imovel imovel) {
        return new ContratoResponseDTO.ImovelResumoDTO(
                imovel.getId(),
                imovel.getNome(),
                imovel.getEndereco(),
                imovel.getTipo().name()
        );
    }

    default ContratoResponseDTO.InquilinoResumoDTO toInquilinoResumo(Inquilino inquilino) {
        return new ContratoResponseDTO.InquilinoResumoDTO(
                inquilino.getId(),
                inquilino.getNome(),
                inquilino.getCpf()
        );
    }
}
