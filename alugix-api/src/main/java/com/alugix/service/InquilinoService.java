package com.alugix.service;

import com.alugix.dto.request.InquilinoRequestDTO;
import com.alugix.dto.response.InquilinoResponseDTO;
import com.alugix.entity.Inquilino;
import com.alugix.entity.Usuario;
import com.alugix.exception.BusinessException;
import com.alugix.exception.ResourceNotFoundException;
import com.alugix.mapper.InquilinoMapper;
import com.alugix.repository.InquilinoRepository;
import com.alugix.repository.UsuarioRepository;
import com.alugix.security.SecurityHelper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InquilinoService {

    private static final Logger logger = LoggerFactory.getLogger(InquilinoService.class);

    private final InquilinoRepository inquilinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InquilinoMapper inquilinoMapper;
    private final SecurityHelper securityHelper;

    public Page<InquilinoResponseDTO> listar(Long targetUsuarioId, Boolean ativo, String busca, Pageable pageable) {
        Long usuarioId = securityHelper.resolverUsuarioId(targetUsuarioId);
        Page<Inquilino> page = (busca == null || busca.isBlank())
                ? inquilinoRepository.findByUsuarioIdAndFiltros(usuarioId, ativo, pageable)
                : inquilinoRepository.findByUsuarioIdAndBusca(usuarioId, ativo, busca, pageable);
        return page.map(inquilinoMapper::toResponse);
    }

    public InquilinoResponseDTO buscarPorId(Long id) {
        Long usuarioId = securityHelper.resolverUsuarioId(null);
        return inquilinoMapper.toResponse(buscarInquilinoDoUsuario(id, usuarioId));
    }

    @Transactional
    public InquilinoResponseDTO criar(InquilinoRequestDTO dto) {
        Long usuarioId = securityHelper.resolverUsuarioId(null);
        validarCpfUnico(dto.cpf(), usuarioId, null);

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Inquilino inquilino = inquilinoMapper.toEntity(dto);
        inquilino.setUsuario(usuario);
        inquilino.setStatus("ATIVO");
        inquilino.setAtivo(true);

        Inquilino salvo = inquilinoRepository.save(inquilino);
        logger.info("Inquilino criado: id={}, usuarioId={}", salvo.getId(), usuarioId);
        return inquilinoMapper.toResponse(salvo);
    }

    @Transactional
    public InquilinoResponseDTO atualizar(Long id, InquilinoRequestDTO dto) {
        Long usuarioId = securityHelper.resolverUsuarioId(null);
        Inquilino inquilino = buscarInquilinoDoUsuario(id, usuarioId);
        validarCpfUnico(dto.cpf(), usuarioId, id);

        inquilinoMapper.updateEntity(dto, inquilino);
        return inquilinoMapper.toResponse(inquilinoRepository.save(inquilino));
    }

    @Transactional
    public InquilinoResponseDTO alternarAtivo(Long id) {
        Long usuarioId = securityHelper.resolverUsuarioId(null);
        Inquilino inquilino = inquilinoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquilino não encontrado"));
        inquilino.setAtivo(!inquilino.getAtivo());
        logger.info("Inquilino id={} ativo alterado para {}", id, inquilino.getAtivo());
        return inquilinoMapper.toResponse(inquilinoRepository.save(inquilino));
    }

    @Transactional
    public void deletar(Long id) {
        Long usuarioId = securityHelper.resolverUsuarioId(null);
        Inquilino inquilino = buscarInquilinoDoUsuario(id, usuarioId);
        inquilinoRepository.delete(inquilino);
        logger.info("Inquilino excluído: id={}, usuarioId={}", id, usuarioId);
    }

    private void validarCpfUnico(String cpf, Long usuarioId, Long idAtual) {
        boolean existe = idAtual == null
                ? inquilinoRepository.existsByCpfAndUsuarioId(cpf, usuarioId)
                : inquilinoRepository.existsByCpfAndUsuarioIdAndIdNot(cpf, usuarioId, idAtual);
        if (existe) {
            throw new BusinessException("CPF já cadastrado para este usuário");
        }
    }

    private Inquilino buscarInquilinoDoUsuario(Long id, Long usuarioId) {
        return inquilinoRepository.findByIdAndUsuarioIdAndAtivoTrue(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquilino não encontrado"));
    }
}
