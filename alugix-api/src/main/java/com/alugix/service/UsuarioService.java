package com.alugix.service;

import com.alugix.dto.request.UsuarioRequestDTO;
import com.alugix.dto.response.UsuarioResponseDTO;
import com.alugix.entity.Usuario;
import com.alugix.exception.BusinessException;
import com.alugix.exception.ResourceNotFoundException;
import com.alugix.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UsuarioResponseDTO> listar(Boolean ativo, Pageable pageable) {
        return usuarioRepository.findByFiltros(ativo, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {
        return toResponse(buscarUsuario(id));
    }

    @Transactional
    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (dto.senha() == null || dto.senha().isBlank()) {
            throw new BusinessException("Senha é obrigatória na criação do usuário");
        }
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new BusinessException("E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario.setPerfil(dto.perfil());
        usuario.setAtivo(true);

        Usuario salvo = usuarioRepository.save(usuario);
        logger.info("Usuário criado: id={}, email={}", salvo.getId(), salvo.getEmail());
        return toResponse(salvo);
    }

    @Transactional
    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = buscarUsuario(id);

        if (!usuario.getEmail().equals(dto.email()) && usuarioRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new BusinessException("E-mail já cadastrado para outro usuário");
        }

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setPerfil(dto.perfil());
        if (dto.senha() != null && !dto.senha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.senha()));
        }

        logger.info("Usuário atualizado: id={}", id);
        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponseDTO alternarAtivo(Long id) {
        Usuario usuario = buscarUsuario(id);
        usuario.setAtivo(!usuario.getAtivo());
        logger.info("Usuário id={} ativo alterado para {}", id, usuario.getAtivo());
        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void deletar(Long id) {
        Usuario usuario = buscarUsuario(id);
        usuarioRepository.delete(usuario);
        logger.info("Usuário excluído: id={}", id);
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private UsuarioResponseDTO toResponse(Usuario u) {
        return new UsuarioResponseDTO(u.getId(), u.getNome(), u.getEmail(), u.getPerfil(), u.getAtivo(), u.getCreatedAt());
    }
}
