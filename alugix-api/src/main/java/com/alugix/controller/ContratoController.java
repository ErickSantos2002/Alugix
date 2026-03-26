package com.alugix.controller;

import com.alugix.dto.request.ContratoRequestDTO;
import com.alugix.dto.response.ContratoResponseDTO;
import com.alugix.enums.StatusContrato;
import com.alugix.service.ContratoService;
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
@RequestMapping("/api/v1/contratos")
@RequiredArgsConstructor
@Tag(name = "Contratos", description = "Gestão de contratos de aluguel")
@SecurityRequirement(name = "bearerAuth")
public class ContratoController {

    private final ContratoService contratoService;

    @GetMapping
    @Operation(summary = "Listar contratos", description = "Lista paginada com filtro opcional por status")
    @ApiResponse(responseCode = "200", description = "Listagem realizada com sucesso")
    public ResponseEntity<Page<ContratoResponseDTO>> listar(
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) StatusContrato status,
            Pageable pageable) {
        return ResponseEntity.ok(contratoService.listar(usuarioId, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar contrato por ID")
    @ApiResponse(responseCode = "200", description = "Contrato encontrado")
    @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    public ResponseEntity<ContratoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(contratoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar contrato", description = "Cria contrato, marca imóvel como ALUGADO e gera pagamentos PENDENTE")
    @ApiResponse(responseCode = "201", description = "Contrato criado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    @ApiResponse(responseCode = "404", description = "Imóvel ou inquilino não encontrado")
    @ApiResponse(responseCode = "422", description = "Imóvel não disponível ou datas inválidas")
    public ResponseEntity<ContratoResponseDTO> criar(@Valid @RequestBody ContratoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contratoService.criar(dto));
    }

    @PatchMapping("/{id}/encerrar")
    @Operation(summary = "Encerrar contrato", description = "Encerra contrato e marca imóvel como DISPONIVEL")
    @ApiResponse(responseCode = "200", description = "Contrato encerrado com sucesso")
    @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    @ApiResponse(responseCode = "422", description = "Contrato já está encerrado")
    public ResponseEntity<ContratoResponseDTO> encerrar(@PathVariable Long id) {
        return ResponseEntity.ok(contratoService.encerrar(id));
    }
}
