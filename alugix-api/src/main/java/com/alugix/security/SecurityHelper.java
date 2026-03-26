package com.alugix.security;

import com.alugix.entity.Usuario;
import com.alugix.enums.Perfil;
import com.alugix.exception.BusinessException;
import com.alugix.exception.ResourceNotFoundException;
import com.alugix.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityHelper {

    private final UsuarioRepository usuarioRepository;

    public Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    /**
     * Resolve o usuarioId alvo:
     * - ADMIN pode passar targetId para consultar dados de outro usuário
     * - USUARIO comum sempre usa o próprio ID (targetId ignorado)
     */
    public Long resolverUsuarioId(Long targetId) {
        Usuario autenticado = getUsuarioAutenticado();
        if (targetId != null && autenticado.getPerfil() == Perfil.ADMIN) {
            return targetId;
        }
        return autenticado.getId();
    }

    public boolean isAdmin() {
        return getUsuarioAutenticado().getPerfil() == Perfil.ADMIN;
    }
}
