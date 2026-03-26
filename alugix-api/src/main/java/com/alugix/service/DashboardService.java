package com.alugix.service;

import com.alugix.dto.response.DashboardContratosVencerDTO;
import com.alugix.dto.response.DashboardInadimplenciaDTO;
import com.alugix.dto.response.DashboardReceitaDTO;
import com.alugix.dto.response.DashboardResumoDTO;
import com.alugix.entity.Contrato;
import com.alugix.entity.Pagamento;
import com.alugix.enums.StatusContrato;
import com.alugix.enums.StatusImovel;
import com.alugix.enums.StatusPagamento;
import com.alugix.exception.ResourceNotFoundException;
import com.alugix.repository.ContratoRepository;
import com.alugix.repository.ImovelRepository;
import com.alugix.repository.InquilinoRepository;
import com.alugix.repository.PagamentoRepository;
import com.alugix.repository.UsuarioRepository;
import com.alugix.security.SecurityHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ImovelRepository imovelRepository;
    private final InquilinoRepository inquilinoRepository;
    private final ContratoRepository contratoRepository;
    private final PagamentoRepository pagamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final SecurityHelper securityHelper;

    @Transactional(readOnly = true)
    public DashboardResumoDTO resumo(Long targetUsuarioId) {
        Long usuarioId = securityHelper.resolverUsuarioId(targetUsuarioId);
        return new DashboardResumoDTO(
                imovelRepository.countByUsuarioIdAndAtivoTrue(usuarioId),
                imovelRepository.countByUsuarioIdAndAtivoTrueAndStatus(usuarioId, StatusImovel.DISPONIVEL),
                imovelRepository.countByUsuarioIdAndAtivoTrueAndStatus(usuarioId, StatusImovel.ALUGADO),
                imovelRepository.countByUsuarioIdAndAtivoTrueAndStatus(usuarioId, StatusImovel.MANUTENCAO),
                inquilinoRepository.countByUsuarioIdAndAtivoTrue(usuarioId),
                contratoRepository.countByUsuarioIdAndStatus(usuarioId, StatusContrato.ATIVO),
                pagamentoRepository.countByContratoUsuarioIdAndStatus(usuarioId, StatusPagamento.ATRASADO)
        );
    }

    @Transactional(readOnly = true)
    public DashboardReceitaDTO receita(Long targetUsuarioId) {
        Long usuarioId = securityHelper.resolverUsuarioId(targetUsuarioId);
        LocalDate hoje = LocalDate.now();

        return new DashboardReceitaDTO(
                hoje.getMonthValue(),
                hoje.getYear(),
                pagamentoRepository.sumReceitaPrevistaByUsuarioId(usuarioId),
                pagamentoRepository.sumReceitaRealizadaByUsuarioId(usuarioId, hoje.getYear(), hoje.getMonthValue()),
                pagamentoRepository.countByContratoUsuarioIdAndStatus(usuarioId, StatusPagamento.PAGO),
                pagamentoRepository.countByContratoUsuarioIdAndStatus(usuarioId, StatusPagamento.PENDENTE),
                pagamentoRepository.countByContratoUsuarioIdAndStatus(usuarioId, StatusPagamento.ATRASADO)
        );
    }

    @Transactional(readOnly = true)
    public DashboardInadimplenciaDTO inadimplencia(Long targetUsuarioId) {
        Long usuarioId = securityHelper.resolverUsuarioId(targetUsuarioId);
        List<Pagamento> atrasados = pagamentoRepository.findAtrasadosByUsuarioId(usuarioId);

        var valorTotal = atrasados.stream()
                .map(p -> p.getContrato().getValorAluguel())
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        var lista = atrasados.stream().map(p -> new DashboardInadimplenciaDTO.PagamentoAtrasadoDTO(
                p.getId(),
                p.getContrato().getId(),
                p.getContrato().getInquilino().getNome(),
                p.getContrato().getImovel().getNome(),
                p.getMesReferencia(),
                p.getDataVencimento(),
                p.getContrato().getValorAluguel(),
                ChronoUnit.DAYS.between(p.getDataVencimento(), LocalDate.now())
        )).toList();

        return new DashboardInadimplenciaDTO(atrasados.size(), valorTotal, lista);
    }

    @Transactional(readOnly = true)
    public DashboardContratosVencerDTO contratosVencer(Long targetUsuarioId, int dias) {
        Long usuarioId = securityHelper.resolverUsuarioId(targetUsuarioId);
        LocalDate hoje = LocalDate.now();
        List<Contrato> contratos = contratoRepository.findContratosVencer(usuarioId, hoje, hoje.plusDays(dias));

        var lista = contratos.stream().map(c -> new DashboardContratosVencerDTO.ContratoVencendoDTO(
                c.getId(),
                c.getInquilino().getNome(),
                c.getImovel().getNome(),
                c.getDataTermino(),
                ChronoUnit.DAYS.between(hoje, c.getDataTermino()),
                c.getValorAluguel()
        )).toList();

        return new DashboardContratosVencerDTO(contratos.size(), lista);
    }

}
