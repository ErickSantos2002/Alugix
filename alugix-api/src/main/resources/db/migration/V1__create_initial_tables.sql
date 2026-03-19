-- V1__create_initial_tables.sql
-- Alugix - Migration Inicial
-- Autor: Erick

-- ========== USUARIOS ==========
CREATE TABLE usuarios (
    id          BIGSERIAL     PRIMARY KEY,
    nome        VARCHAR(150)  NOT NULL,
    email       VARCHAR(200)  NOT NULL UNIQUE,
    senha       VARCHAR(255)  NOT NULL,
    perfil      VARCHAR(20)   NOT NULL CHECK (perfil IN ('ADMIN', 'USUARIO')),
    ativo       BOOLEAN       NOT NULL DEFAULT true,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ========== IMOVEIS ==========
CREATE TABLE imoveis (
    id             BIGSERIAL      PRIMARY KEY,
    usuario_id     BIGINT         NOT NULL REFERENCES usuarios(id),
    endereco       VARCHAR(300)   NOT NULL,
    cep            VARCHAR(10)    NOT NULL,
    cidade         VARCHAR(100)   NOT NULL,
    estado         VARCHAR(2)     NOT NULL,
    tipo           VARCHAR(20)    NOT NULL CHECK (tipo IN ('CASA', 'APARTAMENTO', 'SALA_COMERCIAL')),
    quartos        INTEGER        NOT NULL DEFAULT 0,
    banheiros      INTEGER        NOT NULL DEFAULT 0,
    area_m2        DECIMAL(10,2),
    valor_aluguel  DECIMAL(10,2)  NOT NULL,
    status         VARCHAR(20)    NOT NULL DEFAULT 'DISPONIVEL' CHECK (status IN ('DISPONIVEL', 'ALUGADO', 'MANUTENCAO')),
    descricao      TEXT,
    ativo          BOOLEAN        NOT NULL DEFAULT true,
    created_at     TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ========== INQUILINOS ==========
CREATE TABLE inquilinos (
    id             BIGSERIAL      PRIMARY KEY,
    usuario_id     BIGINT         NOT NULL REFERENCES usuarios(id),
    nome           VARCHAR(200)   NOT NULL,
    cpf            VARCHAR(14)    NOT NULL,
    telefone       VARCHAR(20)    NOT NULL,
    email          VARCHAR(200),
    renda_mensal   DECIMAL(10,2),
    status         VARCHAR(20)    NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
    ativo          BOOLEAN        NOT NULL DEFAULT true,
    created_at     TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ========== CONTRATOS ==========
CREATE TABLE contratos (
    id              BIGSERIAL      PRIMARY KEY,
    usuario_id      BIGINT         NOT NULL REFERENCES usuarios(id),
    imovel_id       BIGINT         NOT NULL REFERENCES imoveis(id),
    inquilino_id    BIGINT         NOT NULL REFERENCES inquilinos(id),
    valor_aluguel   DECIMAL(10,2)  NOT NULL,
    data_inicio     DATE           NOT NULL,
    data_termino    DATE           NOT NULL,
    dia_vencimento  INTEGER        NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    status          VARCHAR(20)    NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'ENCERRADO', 'ATRASADO')),
    observacoes     TEXT,
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ========== PAGAMENTOS ==========
CREATE TABLE pagamentos (
    id               BIGSERIAL      PRIMARY KEY,
    contrato_id      BIGINT         NOT NULL REFERENCES contratos(id),
    mes_referencia   DATE           NOT NULL,
    valor_pago       DECIMAL(10,2)  NOT NULL DEFAULT 0,
    data_pagamento   DATE,
    data_vencimento  DATE           NOT NULL,
    status           VARCHAR(20)    NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PAGO', 'PENDENTE', 'ATRASADO')),
    forma_pagamento  VARCHAR(50),
    observacoes      TEXT,
    created_at       TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ========== INDICES ==========
CREATE INDEX idx_imoveis_usuario        ON imoveis(usuario_id);
CREATE INDEX idx_imoveis_status         ON imoveis(status);
CREATE INDEX idx_inquilinos_usuario     ON inquilinos(usuario_id);
CREATE UNIQUE INDEX idx_inquilinos_cpf  ON inquilinos(usuario_id, cpf);
CREATE INDEX idx_contratos_usuario      ON contratos(usuario_id);
CREATE INDEX idx_contratos_imovel       ON contratos(imovel_id);
CREATE INDEX idx_contratos_status       ON contratos(status);
CREATE INDEX idx_pagamentos_contrato    ON pagamentos(contrato_id);
CREATE INDEX idx_pagamentos_status      ON pagamentos(status);
CREATE INDEX idx_pagamentos_vencimento  ON pagamentos(data_vencimento);
