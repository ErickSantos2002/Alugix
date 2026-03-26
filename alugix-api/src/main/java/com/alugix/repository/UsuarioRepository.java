package com.alugix.repository;

import com.alugix.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("SELECT u FROM Usuario u WHERE (:ativo IS NULL OR u.ativo = :ativo)")
    Page<Usuario> findByFiltros(@Param("ativo") Boolean ativo, Pageable pageable);
}
