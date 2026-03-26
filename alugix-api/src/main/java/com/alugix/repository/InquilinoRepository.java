package com.alugix.repository;

import com.alugix.entity.Inquilino;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InquilinoRepository extends JpaRepository<Inquilino, Long> {

    @Query("""
            SELECT i FROM Inquilino i
            WHERE i.usuario.id = :usuarioId
              AND (:ativo IS NULL OR i.ativo = :ativo)
            """)
    Page<Inquilino> findByUsuarioIdAndFiltros(
            @Param("usuarioId") Long usuarioId,
            @Param("ativo") Boolean ativo,
            Pageable pageable);

    @Query("""
            SELECT i FROM Inquilino i
            WHERE i.usuario.id = :usuarioId
              AND (:ativo IS NULL OR i.ativo = :ativo)
              AND (LOWER(i.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
                   OR i.cpf LIKE CONCAT('%', :busca, '%'))
            """)
    Page<Inquilino> findByUsuarioIdAndBusca(
            @Param("usuarioId") Long usuarioId,
            @Param("ativo") Boolean ativo,
            @Param("busca") String busca,
            Pageable pageable);

    Optional<Inquilino> findByIdAndUsuarioIdAndAtivoTrue(Long id, Long usuarioId);

    Optional<Inquilino> findByIdAndUsuarioId(Long id, Long usuarioId);

    boolean existsByCpfAndUsuarioId(String cpf, Long usuarioId);

    boolean existsByCpfAndUsuarioIdAndIdNot(String cpf, Long usuarioId, Long id);

    long countByUsuarioIdAndAtivoTrue(Long usuarioId);
}
