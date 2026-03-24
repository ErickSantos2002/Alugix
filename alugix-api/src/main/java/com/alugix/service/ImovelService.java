package com.alugix.service;

import com.alugix.dto.request.ImovelRequestDTO;
import com.alugix.dto.request.ImovelStatusRequestDTO;
import com.alugix.dto.response.ImovelResponseDTO;
import com.alugix.entity.Imovel;
import com.alugix.entity.Usuario;
import com.alugix.enums.StatusImovel;
import com.alugix.enums.TipoImovel;
import com.alugix.exception.BusinessException;
import com.alugix.exception.ResourceNotFoundException;
import com.alugix.mapper.ImovelMapper;
import com.alugix.repository.ImovelRepository;
import com.alugix.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ImovelService {

    private static final Logger logger = LoggerFactory.getLogger(ImovelService.class);

    private final ImovelRepository imovelRepository;
    private final UsuarioRepository usuarioRepository;
    private final ImovelMapper imovelMapper;

    public Page<ImovelResponseDTO> listar(Boolean ativo, StatusImovel status, TipoImovel tipo, Pageable pageable) {
        Long usuarioId = getUsuarioIdAutenticado();
        return imovelRepository.findByUsuarioIdAndFiltros(usuarioId, ativo, status, tipo, pageable)
                .map(imovelMapper::toResponse);
    }

    public ImovelResponseDTO buscarPorId(Long id) {
        Long usuarioId = getUsuarioIdAutenticado();
        return imovelMapper.toResponse(buscarImovelDoUsuario(id, usuarioId));
    }

    @Transactional
    public ImovelResponseDTO criar(ImovelRequestDTO dto) {
        Long usuarioId = getUsuarioIdAutenticado();
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Imovel imovel = imovelMapper.toEntity(dto);
        imovel.setUsuario(usuario);
        imovel.setStatus(StatusImovel.DISPONIVEL);
        imovel.setAtivo(true);

        Imovel salvo = imovelRepository.save(imovel);
        logger.info("Imóvel criado: id={}, usuarioId={}", salvo.getId(), usuarioId);
        return imovelMapper.toResponse(salvo);
    }

    @Transactional
    public ImovelResponseDTO atualizar(Long id, ImovelRequestDTO dto) {
        Long usuarioId = getUsuarioIdAutenticado();
        Imovel imovel = buscarImovelDoUsuario(id, usuarioId);
        if (dto.status() != null) {
            if (imovel.getStatus() == StatusImovel.ALUGADO) {
                throw new BusinessException("Imóvel alugado não pode ter o status alterado manualmente");
            }
            if (dto.status() == StatusImovel.ALUGADO) {
                throw new BusinessException("Status ALUGADO é gerenciado automaticamente pelo sistema");
            }
        }
        imovelMapper.updateEntity(dto, imovel);
        return imovelMapper.toResponse(imovelRepository.save(imovel));
    }

    @Transactional
    public ImovelResponseDTO alternarAtivo(Long id) {
        Long usuarioId = getUsuarioIdAutenticado();
        Imovel imovel = imovelRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado"));
        imovel.setAtivo(!imovel.getAtivo());
        logger.info("Imóvel id={} ativo alterado para {}", id, imovel.getAtivo());
        return imovelMapper.toResponse(imovelRepository.save(imovel));
    }

    @Transactional
    public ImovelResponseDTO atualizarStatus(Long id, ImovelStatusRequestDTO dto) {
        Long usuarioId = getUsuarioIdAutenticado();
        Imovel imovel = buscarImovelDoUsuario(id, usuarioId);

        if (imovel.getStatus() == StatusImovel.ALUGADO) {
            throw new BusinessException("Imóvel alugado não pode ter o status alterado manualmente");
        }
        if (dto.status() == StatusImovel.ALUGADO) {
            throw new BusinessException("Status ALUGADO é gerenciado automaticamente pelo sistema");
        }

        imovel.setStatus(dto.status());
        logger.info("Status do imóvel id={} alterado para {} por usuarioId={}", id, dto.status(), usuarioId);
        return imovelMapper.toResponse(imovelRepository.save(imovel));
    }

    @Transactional
    public void deletar(Long id) {
        Long usuarioId = getUsuarioIdAutenticado();
        Imovel imovel = buscarImovelDoUsuario(id, usuarioId);
        imovelRepository.delete(imovel);
        logger.info("Imóvel excluído: id={}, usuarioId={}", id, usuarioId);
    }

    private Imovel buscarImovelDoUsuario(Long id, Long usuarioId) {
        return imovelRepository.findByIdAndUsuarioIdAndAtivoTrue(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado"));
    }

    private Long getUsuarioIdAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"))
                .getId();
    }
}
