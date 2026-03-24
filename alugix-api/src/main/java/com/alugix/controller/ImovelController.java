package com.alugix.controller;

import com.alugix.dto.request.ImovelRequestDTO;
import com.alugix.dto.request.ImovelStatusRequestDTO;
import com.alugix.dto.response.ImovelResponseDTO;
import com.alugix.enums.StatusImovel;
import com.alugix.enums.TipoImovel;
import com.alugix.service.ImovelService;
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
@RequestMapping("/api/v1/imoveis")
@RequiredArgsConstructor
@Tag(name = "Imóveis", description = "CRUD de imóveis do usuário autenticado")
@SecurityRequirement(name = "bearerAuth")
public class ImovelController {

    private final ImovelService imovelService;

    @GetMapping
    @Operation(summary = "Listar imóveis", description = "Lista paginada com filtros opcionais de status e tipo")
    @ApiResponse(responseCode = "200", description = "Listagem realizada com sucesso")
    public ResponseEntity<Page<ImovelResponseDTO>> listar(
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) StatusImovel status,
            @RequestParam(required = false) TipoImovel tipo,
            Pageable pageable) {
        return ResponseEntity.ok(imovelService.listar(ativo, status, tipo, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar imóvel por ID")
    @ApiResponse(responseCode = "200", description = "Imóvel encontrado")
    @ApiResponse(responseCode = "404", description = "Imóvel não encontrado")
    public ResponseEntity<ImovelResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(imovelService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cadastrar imóvel")
    @ApiResponse(responseCode = "201", description = "Imóvel criado com sucesso")
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
    public ResponseEntity<ImovelResponseDTO> criar(@Valid @RequestBody ImovelRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imovelService.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar imóvel")
    @ApiResponse(responseCode = "200", description = "Imóvel atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Imóvel não encontrado")
    public ResponseEntity<ImovelResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ImovelRequestDTO dto) {
        return ResponseEntity.ok(imovelService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Alterar status do imóvel", description = "Permite alternar entre DISPONIVEL e MANUTENCAO. Status ALUGADO é gerenciado automaticamente pelo sistema.")
    @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Imóvel não encontrado")
    @ApiResponse(responseCode = "422", description = "Operação não permitida para o status atual")
    public ResponseEntity<ImovelResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody ImovelStatusRequestDTO dto) {
        return ResponseEntity.ok(imovelService.atualizarStatus(id, dto));
    }

    @PatchMapping("/{id}/ativo")
    @Operation(summary = "Alternar ativo/inativo do imóvel", description = "Desativa ou reativa um imóvel sem excluí-lo do sistema.")
    @ApiResponse(responseCode = "200", description = "Estado alterado com sucesso")
    @ApiResponse(responseCode = "404", description = "Imóvel não encontrado")
    public ResponseEntity<ImovelResponseDTO> alternarAtivo(@PathVariable Long id) {
        return ResponseEntity.ok(imovelService.alternarAtivo(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir imóvel permanentemente")
    @ApiResponse(responseCode = "204", description = "Imóvel excluído com sucesso")
    @ApiResponse(responseCode = "404", description = "Imóvel não encontrado")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        imovelService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
