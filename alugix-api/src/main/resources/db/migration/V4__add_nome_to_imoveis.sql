-- V4__add_nome_to_imoveis.sql
-- Adiciona campo nome ao imóvel (apelido para identificação fácil)

ALTER TABLE imoveis ADD COLUMN nome VARCHAR(150) NOT NULL DEFAULT '';

-- Remove o DEFAULT depois de preencher
ALTER TABLE imoveis ALTER COLUMN nome DROP DEFAULT;
