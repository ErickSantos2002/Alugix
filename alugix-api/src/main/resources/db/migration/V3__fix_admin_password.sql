-- V3__fix_admin_password.sql
-- Corrige o hash BCrypt do admin (Admin@2026)

UPDATE usuarios
SET senha = '$2b$10$XnnSz.TaLGyT9rit9BIZSO93BM4T6QWPZbFY1c3E5YV5H3NpxMzXi'
WHERE email = 'admin@alugix.com';
