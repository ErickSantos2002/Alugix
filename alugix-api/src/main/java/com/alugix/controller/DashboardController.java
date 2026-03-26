package com.alugix.controller;

import com.alugix.dto.response.DashboardContratosVencerDTO;
import com.alugix.dto.response.DashboardInadimplenciaDTO;
import com.alugix.dto.response.DashboardReceitaDTO;
import com.alugix.dto.response.DashboardResumoDTO;
import com.alugix.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Indicadores e relatórios agregados")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumo")
    @Operation(summary = "Resumo geral", description = "Totais de imóveis por status, inquilinos, contratos e inadimplência")
    @ApiResponse(responseCode = "200", description = "Resumo gerado com sucesso")
    public ResponseEntity<DashboardResumoDTO> resumo() {
        return ResponseEntity.ok(dashboardService.resumo());
    }

    @GetMapping("/receita")
    @Operation(summary = "Receita do mês", description = "Receita prevista vs realizada no mês atual com contagem de pagamentos por status")
    @ApiResponse(responseCode = "200", description = "Dados de receita gerados com sucesso")
    public ResponseEntity<DashboardReceitaDTO> receita() {
        return ResponseEntity.ok(dashboardService.receita());
    }

    @GetMapping("/inadimplencia")
    @Operation(summary = "Inadimplência", description = "Lista de pagamentos atrasados com inquilino, imóvel e dias em atraso")
    @ApiResponse(responseCode = "200", description = "Dados de inadimplência gerados com sucesso")
    public ResponseEntity<DashboardInadimplenciaDTO> inadimplencia() {
        return ResponseEntity.ok(dashboardService.inadimplencia());
    }

    @GetMapping("/contratos-vencer")
    @Operation(summary = "Contratos a vencer", description = "Contratos ativos que vencem nos próximos N dias (padrão: 30)")
    @ApiResponse(responseCode = "200", description = "Lista gerada com sucesso")
    public ResponseEntity<DashboardContratosVencerDTO> contratosVencer(
            @RequestParam(defaultValue = "30") int dias) {
        return ResponseEntity.ok(dashboardService.contratosVencer(dias));
    }
}
