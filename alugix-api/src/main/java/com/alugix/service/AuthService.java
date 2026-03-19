package com.alugix.service;

import com.alugix.dto.request.LoginRequestDTO;
import com.alugix.dto.response.LoginResponseDTO;
import com.alugix.entity.Usuario;
import com.alugix.repository.UsuarioRepository;
import com.alugix.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;

    @Value("${jwt.expiration}")
    private long expiration;

    public LoginResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow();

        logger.info("Login realizado: {}", usuario.getEmail());

        String token = jwtTokenProvider.gerarToken(
                usuario.getEmail(),
                usuario.getPerfil().name(),
                usuario.getId()
        );

        return LoginResponseDTO.builder()
                .token(token)
                .tipo("Bearer")
                .expiresIn(expiration)
                .nome(usuario.getNome())
                .perfil(usuario.getPerfil().name())
                .build();
    }
}
