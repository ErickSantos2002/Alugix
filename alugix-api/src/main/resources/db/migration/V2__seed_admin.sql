-- V2__seed_admin.sql
-- Alugix - Seed do usuário administrador padrão
-- Autor: Erick
-- Senha: Admin@2026 (hash BCrypt)

INSERT INTO usuarios (nome, email, senha, perfil, ativo)
VALUES (
    'Administrador',
    'admin@alugix.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqkK5R1KqP5A8N1PmPtY7qR5THjWe',
    'ADMIN',
    true
);
