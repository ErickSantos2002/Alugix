package com.alugix.service;

import com.alugix.dto.request.ContratoRequestDTO;
import com.alugix.dto.response.ContratoResponseDTO;
import com.alugix.entity.Contrato;
import com.alugix.entity.Imovel;
import com.alugix.entity.Inquilino;
import com.alugix.entity.Pagamento;
import com.alugix.entity.Usuario;
import com.alugix.enums.StatusContrato;
import com.alugix.enums.StatusImovel;
import com.alugix.enums.StatusPagamento;
import com.alugix.exception.BusinessException;
import com.alugix.exception.ResourceNotFoundException;
import com.alugix.mapper.ContratoMapper;
import com.alugix.repository.ContratoRepository;
import com.alugix.repository.ImovelRepository;
import com.alugix.repository.InquilinoRepository;
import com.alugix.repository.PagamentoRepository;
import com.alugix.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratoService {

    private static final Logger logger = LoggerFactory.getLogger(ContratoService.class);

    private final ContratoRepository contratoRepository;
    private final ImovelRepository imovelRepository;
    private final InquilinoRepository inquilinoRepository;
    private final PagamentoRepository pagamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContratoMapper contratoMapper;

    public Page<ContratoResponseDTO> listar(StatusContrato status, Pageable pageable) {
        Long usuarioId = getUsuarioIdAutenticado();
        return contratoRepository.findByUsuarioIdAndFiltros(usuarioId, status, pageable)
                .map(contratoMapper::toResponse);
    }

    public ContratoResponseDTO buscarPorId(Long id) {
        Long usuarioId = getUsuarioIdAutenticado();
        return contratoMapper.toResponse(buscarContratoDoUsuario(id, usuarioId));
    }

    @Transactional
    public ContratoResponseDTO criar(ContratoRequestDTO dto) {
        Long usuarioId = getUsuarioIdAutenticado();
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Imovel imovel = imovelRepository.findByIdAndUsuarioIdAndAtivoTrue(dto.imovelId(), usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado"));

        Inquilino inquilino = inquilinoRepository.findByIdAndUsuarioIdAndAtivoTrue(dto.inquilinoId(), usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquilino não encontrado"));

        validarImovelDisponivel(imovel);
        validarDatasContrato(dto.dataInicio(), dto.dataTermino());

        Contrato contrato = new Contrato();
        contrato.setUsuario(usuario);
        contrato.setImovel(imovel);
        contrato.setInquilino(inquilino);
        contrato.setValorAluguel(dto.valorAluguel());
        contrato.setDataInicio(dto.dataInicio());
        contrato.setDataTermino(dto.dataTermino());
        contrato.setDiaVencimento(dto.diaVencimento());
        contrato.setStatus(StatusContrato.ATIVO);
        contrato.setObservacoes(dto.observacoes());

        imovel.setStatus(StatusImovel.ALUGADO);
        imovelRepository.save(imovel);

        Contrato salvo = contratoRepository.save(contrato);
        gerarPagamentos(salvo);

        logger.info("Contrato criado: id={}, imovelId={}, inquilinoId={}", salvo.getId(), imovel.getId(), inquilino.getId());
        return contratoMapper.toResponse(salvo);
    }

    @Transactional
    public ContratoResponseDTO encerrar(Long id) {
        Long usuarioId = getUsuarioIdAutenticado();
        Contrato contrato = buscarContratoDoUsuario(id, usuarioId);

        if (contrato.getStatus() == StatusContrato.ENCERRADO) {
            throw new BusinessException("Contrato já está encerrado");
        }

        contrato.setStatus(StatusContrato.ENCERRADO);
        contrato.getImovel().setStatus(StatusImovel.DISPONIVEL);
        imovelRepository.save(contrato.getImovel());

        logger.info("Contrato encerrado: id={}, imovelId={}", id, contrato.getImovel().getId());
        return contratoMapper.toResponse(contratoRepository.save(contrato));
    }

    private void gerarPagamentos(Contrato contrato) {
        List<Pagamento> pagamentos = new ArrayList<>();
        LocalDate mes = contrato.getDataInicio().withDayOfMonth(1);
        LocalDate ultimoMes = contrato.getDataTermino().withDayOfMonth(1);

        while (!mes.isAfter(ultimoMes)) {
            int diaVenc = Math.min(contrato.getDiaVencimento(), mes.lengthOfMonth());
            LocalDate vencimento = mes.withDayOfMonth(diaVenc);

            Pagamento pagamento = new Pagamento();
            pagamento.setContrato(contrato);
            pagamento.setMesReferencia(mes);
            pagamento.setDataVencimento(vencimento);
            pagamento.setValorPago(BigDecimal.ZERO);
            pagamento.setStatus(StatusPagamento.PENDENTE);
            pagamentos.add(pagamento);

            mes = mes.plusMonths(1);
        }

        pagamentoRepository.saveAll(pagamentos);
        logger.info("Gerados {} pagamentos para contrato id={}", pagamentos.size(), contrato.getId());
    }

    private void validarImovelDisponivel(Imovel imovel) {
        if (imovel.getStatus() != StatusImovel.DISPONIVEL) {
            throw new BusinessException("Imóvel não está disponível. Status atual: " + imovel.getStatus());
        }
    }

    private void validarDatasContrato(LocalDate dataInicio, LocalDate dataTermino) {
        if (!dataTermino.isAfter(dataInicio)) {
            throw new BusinessException("Data de término deve ser posterior à data de início");
        }
    }

    private Contrato buscarContratoDoUsuario(Long id, Long usuarioId) {
        return contratoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato não encontrado"));
    }

    private Long getUsuarioIdAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"))
                .getId();
    }
}
