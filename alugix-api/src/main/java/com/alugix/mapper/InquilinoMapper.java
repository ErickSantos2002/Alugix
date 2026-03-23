package com.alugix.mapper;

import com.alugix.dto.request.InquilinoRequestDTO;
import com.alugix.dto.response.InquilinoResponseDTO;
import com.alugix.entity.Inquilino;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface InquilinoMapper {

    Inquilino toEntity(InquilinoRequestDTO dto);

    InquilinoResponseDTO toResponse(Inquilino inquilino);

    void updateEntity(InquilinoRequestDTO dto, @MappingTarget Inquilino inquilino);
}
