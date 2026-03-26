package com.alugix.dto.request;

import com.alugix.enums.Perfil;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(

        @NotBlank
        @Size(max = 150)
        @Schema(description = "Nome completo", example = "João Silva")
        String nome,

        @NotBlank
        @Email
        @Size(max = 200)
        @Schema(description = "E-mail de acesso", example = "joao@email.com")
        String email,

        @Size(min = 6, max = 100)
        @Schema(description = "Senha (obrigatória na criação, opcional na edição)", example = "Senha@123")
        String senha,

        @NotNull
        @Schema(description = "Perfil do usuário", example = "USUARIO")
        Perfil perfil
) {}
