package com.alugix.mapper;

import com.alugix.dto.request.ImovelRequestDTO;
import com.alugix.dto.response.ImovelResponseDTO;
import com.alugix.entity.Imovel;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ImovelMapper {

    Imovel toEntity(ImovelRequestDTO dto);

    ImovelResponseDTO toResponse(Imovel imovel);

    void updateEntity(ImovelRequestDTO dto, @MappingTarget Imovel imovel);
}
