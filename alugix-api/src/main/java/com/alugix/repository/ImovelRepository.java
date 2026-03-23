package com.alugix.repository;

import com.alugix.entity.Imovel;
import com.alugix.enums.StatusImovel;
import com.alugix.enums.TipoImovel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ImovelRepository extends JpaRepository<Imovel, Long> {

    @Query("""
            SELECT i FROM Imovel i
            WHERE i.usuario.id = :usuarioId
              AND i.ativo = true
              AND (:status IS NULL OR i.status = :status)
              AND (:tipo IS NULL OR i.tipo = :tipo)
            """)
    Page<Imovel> findByUsuarioIdAndFiltros(
            @Param("usuarioId") Long usuarioId,
            @Param("status") StatusImovel status,
            @Param("tipo") TipoImovel tipo,
            Pageable pageable);

    Optional<Imovel> findByIdAndUsuarioIdAndAtivoTrue(Long id, Long usuarioId);
}
