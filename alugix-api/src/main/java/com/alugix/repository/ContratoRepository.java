package com.alugix.repository;

import com.alugix.entity.Contrato;
import com.alugix.enums.StatusContrato;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    @Query(
        value = """
                SELECT c FROM Contrato c
                JOIN FETCH c.imovel
                JOIN FETCH c.inquilino
                WHERE c.usuario.id = :usuarioId
                  AND (:status IS NULL OR c.status = :status)
                """,
        countQuery = """
                SELECT COUNT(c) FROM Contrato c
                WHERE c.usuario.id = :usuarioId
                  AND (:status IS NULL OR c.status = :status)
                """
    )
    Page<Contrato> findByUsuarioIdAndFiltros(
            @Param("usuarioId") Long usuarioId,
            @Param("status") StatusContrato status,
            Pageable pageable);

    Optional<Contrato> findByIdAndUsuarioId(Long id, Long usuarioId);

    boolean existsByImovelIdAndStatus(Long imovelId, StatusContrato status);
}
