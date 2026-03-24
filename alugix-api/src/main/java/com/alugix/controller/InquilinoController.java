package com.alugix.controller;

import com.alugix.dto.request.InquilinoRequestDTO;
import com.alugix.dto.response.InquilinoResponseDTO;
import com.alugix.service.InquilinoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inquilinos")
@RequiredArgsConstructor
@Tag(name = "Inquilinos", description = "CRUD de inquilinos do usuário autenticado")
@SecurityRequirement(name = "bearerAuth")
public class InquilinoController {

    private final InquilinoService inquilinoService;

    @GetMapping
    @Operation(summary = "Listar inquilinos", description = "Lista paginada com busca opcional por nome ou CPF")
    @ApiResponse(responseCode = "200", description = "Listagem realizada com sucesso")
    public ResponseEntity<Page<InquilinoResponseDTO>> listar(
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) String busca,
            Pageable pageable) {
        return ResponseEntity.ok(inquilinoService.listar(ativo, busca, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar inquilino por ID")
    @ApiResponse(responseCode = "200", description = "Inquilino encontrado")
    @ApiResponse(responseCode = "404", description = "Inquilino não encontrado")
    public ResponseEntity<InquilinoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(inquilinoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cadastrar inquilino")
    @ApiResponse(responseCode = "201", description = "Inquilino criado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos ou CPF inválido")
    @ApiResponse(responseCode = "422", description = "CPF já cadastrado para este usuário")
    public ResponseEntity<InquilinoResponseDTO> criar(@Valid @RequestBody InquilinoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inquilinoService.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar inquilino")
    @ApiResponse(responseCode = "200", description = "Inquilino atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Inquilino não encontrado")
    @ApiResponse(responseCode = "422", description = "CPF já cadastrado para este usuário")
    public ResponseEntity<InquilinoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody InquilinoRequestDTO dto) {
        return ResponseEntity.ok(inquilinoService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/ativo")
    @Operation(summary = "Alternar ativo/inativo do inquilino", description = "Desativa ou reativa um inquilino sem excluí-lo do sistema.")
    @ApiResponse(responseCode = "200", description = "Estado alterado com sucesso")
    @ApiResponse(responseCode = "404", description = "Inquilino não encontrado")
    public ResponseEntity<InquilinoResponseDTO> alternarAtivo(@PathVariable Long id) {
        return ResponseEntity.ok(inquilinoService.alternarAtivo(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir inquilino permanentemente")
    @ApiResponse(responseCode = "204", description = "Inquilino excluído com sucesso")
    @ApiResponse(responseCode = "404", description = "Inquilino não encontrado")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        inquilinoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
