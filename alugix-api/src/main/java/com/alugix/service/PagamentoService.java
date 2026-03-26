package com.alugix.service;

import com.alugix.dto.request.PagamentoRequestDTO;
import com.alugix.dto.response.PagamentoResponseDTO;
import com.alugix.entity.Pagamento;
import com.alugix.enums.StatusPagamento;
import com.alugix.exception.BusinessException;
import com.alugix.exception.ResourceNotFoundException;
import com.alugix.mapper.PagamentoMapper;
import com.alugix.repository.ContratoRepository;
import com.alugix.repository.PagamentoRepository;
import com.alugix.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private static final Logger logger = LoggerFactory.getLogger(PagamentoService.class);

    private final PagamentoRepository pagamentoRepository;
    private final ContratoRepository contratoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PagamentoMapper pagamentoMapper;

    @Transactional(readOnly = true)
    public Page<PagamentoResponseDTO> listarPorContrato(Long contratoId, Pageable pageable) {
        Long usuarioId = getUsuarioIdAutenticado();
        validarContratoDoUsuario(contratoId, usuarioId);
        return pagamentoRepository.findByContratoId(contratoId, pageable)
                .map(pagamentoMapper::toResponse);
    }

    @Transactional
    public PagamentoResponseDTO registrarPagamento(Long id, PagamentoRequestDTO dto) {
        Long usuarioId = getUsuarioIdAutenticado();
        Pagamento pagamento = pagamentoRepository.findByIdAndContratoUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado"));

        if (pagamento.getStatus() == StatusPagamento.PAGO) {
            throw new BusinessException("Pagamento já foi registrado");
        }

        pagamento.setValorPago(dto.valorPago());
        pagamento.setDataPagamento(dto.dataPagamento());
        pagamento.setFormaPagamento(dto.formaPagamento());
        pagamento.setObservacoes(dto.observacoes());
        pagamento.setStatus(StatusPagamento.PAGO);

        logger.info("Pagamento registrado: id={}, contratoId={}", id, pagamento.getContrato().getId());
        return pagamentoMapper.toResponse(pagamentoRepository.save(pagamento));
    }

    @Scheduled(cron = "0 0 6 * * *")
    @Transactional
    public void marcarPagamentosAtrasados() {
        List<Pagamento> vencidos = pagamentoRepository.findVencidosPendentes(
                StatusPagamento.PENDENTE, LocalDate.now());

        vencidos.forEach(p -> p.setStatus(StatusPagamento.ATRASADO));
        pagamentoRepository.saveAll(vencidos);

        if (!vencidos.isEmpty()) {
            logger.info("Job: {} pagamentos marcados como ATRASADO", vencidos.size());
        }
    }

    private void validarContratoDoUsuario(Long contratoId, Long usuarioId) {
        contratoRepository.findByIdAndUsuarioId(contratoId, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato não encontrado"));
    }

    private Long getUsuarioIdAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"))
                .getId();
    }
}
