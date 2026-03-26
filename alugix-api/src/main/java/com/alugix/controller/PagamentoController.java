package com.alugix.controller;

import com.alugix.dto.request.PagamentoRequestDTO;
import com.alugix.dto.response.PagamentoResponseDTO;
import com.alugix.service.PagamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Pagamentos", description = "Gestão de pagamentos por contrato")
@SecurityRequirement(name = "bearerAuth")
public class PagamentoController {

    private final PagamentoService pagamentoService;

    @GetMapping("/api/v1/contratos/{contratoId}/pagamentos")
    @Operation(summary = "Listar pagamentos do contrato", description = "Lista paginada de todos os pagamentos de um contrato")
    @ApiResponse(responseCode = "200", description = "Listagem realizada com sucesso")
    @ApiResponse(responseCode = "404", description = "Contrato não encontrado")
    public ResponseEntity<Page<PagamentoResponseDTO>> listar(
            @PathVariable Long contratoId,
            Pageable pageable) {
        return ResponseEntity.ok(pagamentoService.listarPorContrato(contratoId, pageable));
    }

    @PatchMapping("/api/v1/pagamentos/{id}/pagar")
    @Operation(summary = "Registrar pagamento", description = "Marca o pagamento como PAGO com valor, data e forma de pagamento")
    @ApiResponse(responseCode = "200", description = "Pagamento registrado com sucesso")
    @ApiResponse(responseCode = "404", description = "Pagamento não encontrado")
    @ApiResponse(responseCode = "422", description = "Pagamento já foi registrado")
    public ResponseEntity<PagamentoResponseDTO> registrar(
            @PathVariable Long id,
            @Valid @RequestBody PagamentoRequestDTO dto) {
        return ResponseEntity.ok(pagamentoService.registrarPagamento(id, dto));
    }
}
