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
    @Operation(summary = "Resumo geral", description = "Totais de imóveis por status, inquilinos, contratos e inadimplência. Admin pode passar ?usuarioId= para ver dados de outro usuário.")
    @ApiResponse(responseCode = "200", description = "Resumo gerado com sucesso")
    public ResponseEntity<DashboardResumoDTO> resumo(@RequestParam(required = false) Long usuarioId) {
        return ResponseEntity.ok(dashboardService.resumo(usuarioId));
    }

    @GetMapping("/receita")
    @Operation(summary = "Receita do mês", description = "Receita prevista vs realizada no mês atual. Admin pode passar ?usuarioId=.")
    @ApiResponse(responseCode = "200", description = "Dados de receita gerados com sucesso")
    public ResponseEntity<DashboardReceitaDTO> receita(@RequestParam(required = false) Long usuarioId) {
        return ResponseEntity.ok(dashboardService.receita(usuarioId));
    }

    @GetMapping("/inadimplencia")
    @Operation(summary = "Inadimplência", description = "Lista de pagamentos atrasados. Admin pode passar ?usuarioId=.")
    @ApiResponse(responseCode = "200", description = "Dados de inadimplência gerados com sucesso")
    public ResponseEntity<DashboardInadimplenciaDTO> inadimplencia(@RequestParam(required = false) Long usuarioId) {
        return ResponseEntity.ok(dashboardService.inadimplencia(usuarioId));
    }

    @GetMapping("/contratos-vencer")
    @Operation(summary = "Contratos a vencer", description = "Contratos ativos que vencem nos próximos N dias (padrão: 30). Admin pode passar ?usuarioId=.")
    @ApiResponse(responseCode = "200", description = "Lista gerada com sucesso")
    public ResponseEntity<DashboardContratosVencerDTO> contratosVencer(
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(defaultValue = "30") int dias) {
        return ResponseEntity.ok(dashboardService.contratosVencer(usuarioId, dias));
    }
}
