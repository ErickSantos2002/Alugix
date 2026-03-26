package com.alugix.repository;

import com.alugix.entity.Pagamento;
import com.alugix.enums.StatusPagamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    Page<Pagamento> findByContratoId(Long contratoId, Pageable pageable);

    Optional<Pagamento> findByIdAndContratoUsuarioId(Long id, Long usuarioId);

    @Query("""
            SELECT p FROM Pagamento p
            WHERE p.status = :status
              AND p.dataVencimento < :hoje
            """)
    List<Pagamento> findVencidosPendentes(
            @Param("status") StatusPagamento status,
            @Param("hoje") LocalDate hoje);

    @Query("""
            SELECT p FROM Pagamento p
            JOIN FETCH p.contrato c
            JOIN FETCH c.imovel
            JOIN FETCH c.inquilino
            WHERE c.usuario.id = :usuarioId
              AND p.status = 'ATRASADO'
            ORDER BY p.dataVencimento ASC
            """)
    List<Pagamento> findAtrasadosByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("""
            SELECT COALESCE(SUM(c.valorAluguel), 0)
            FROM Contrato c
            WHERE c.usuario.id = :usuarioId
              AND c.status = 'ATIVO'
            """)
    java.math.BigDecimal sumReceitaPrevistaByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("""
            SELECT COALESCE(SUM(p.valorPago), 0)
            FROM Pagamento p
            WHERE p.contrato.usuario.id = :usuarioId
              AND p.status = 'PAGO'
              AND YEAR(p.dataPagamento) = :ano
              AND MONTH(p.dataPagamento) = :mes
            """)
    java.math.BigDecimal sumReceitaRealizadaByUsuarioId(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano,
            @Param("mes") int mes);

    long countByContratoUsuarioIdAndStatus(Long usuarioId, StatusPagamento status);
}
