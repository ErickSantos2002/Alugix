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
}
