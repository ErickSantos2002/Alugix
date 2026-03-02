**ALUGIX**

Modelo de Banco de Dados

Diagrama ER • Esquema SQL • Índices • Migrations

*PostgreSQL 16 — Flyway Migrations*

**Versão 1.0 — Fevereiro de 2026 — Responsável: Erick**

**Sumário**

# 1. Visão Geral

# 2. Diagrama de Relacionamentos (ER)

# 3. Esquema das Tabelas

  - 3.1 usuarios
  - 3.2 imoveis
  - 3.3 inquilinos
  - 3.4 contratos
  - 3.5 pagamentos

# 4. Índices

# 5. Script SQL Completo (Migration V1)

# 6. Seed de Dados (Migration V2)

# 7. Convenções

# 1. Visão Geral

O banco de dados do Alugix utiliza PostgreSQL 16 com 5 tabelas principais. As migrations são gerenciadas pelo Flyway e versionadas no repositório Git.

**Legenda de cores nas tabelas:**

- 🟩 Verde = Chave Primária (PK)

- 🟦 Azul = Chave Estrangeira (FK)

- ⬜ Branco = Campo comum

# 2. Diagrama de Relacionamentos (ER)

Diagrama textual das relações entre as tabelas:

> ┌──────────────┐
 │ USUARIOS │
 │──────────────│
 │ PK id │
 │ nome │
 │ email │
 │ senha │
 │ perfil │
 └──────┬───────┘
 │
 ├─────────────────────────────────────┐
 │ 1:N │
 ▼ ▼
 ┌──────────────┐ ┌──────────────┐
 │ IMOVEIS │ │ INQUILINOS │
 │──────────────│ │──────────────│
 │ PK id │ │ PK id │
 │ FK usuario_id│ │ FK usuario_id│
 │ endereco │ │ nome │
 │ tipo │ │ cpf │
 │ valor_aluguel│ │ telefone │
 │ status │ │ status │
 └──────┬───────┘ └──────┬───────┘
 │ 1:N │
 └─────────────┬──────────────┘
 ▼
 ┌──────────────┐
 │ CONTRATOS │
 │──────────────│
 │ PK id │
 │ FK usuario_id│
 │ FK imovel_id │
 │ FK inquil_id │
 │ valor_aluguel│
 │ status │
 └──────┬───────┘
 │ 1:N
 ▼
 ┌──────────────┐
 │ PAGAMENTOS │
 │──────────────│
 │ PK id │
 │ FK contrat_id│
 │ valor_pago │
 │ status │
 └──────────────┘

# 3. Esquema Detalhado das Tabelas

## 3.1 Tabela: usuarios

Armazena os usuários do sistema.

|            |              |                        |                     |
|------------|--------------|------------------------|---------------------|
| **Campo**  | **Tipo**     | **Restrições**         | **Descrição**       |
| id         | BIGSERIAL    | PRIMARY KEY            | Identificador único |
| nome       | VARCHAR(150) | NOT NULL               | Nome completo       |
| email      | VARCHAR(200) | NOT NULL, UNIQUE       | E-mail de acesso    |
| senha      | VARCHAR(255) | NOT NULL               | Hash BCrypt         |
| perfil     | VARCHAR(20)  | NOT NULL               | ADMIN ou USUARIO    |
| ativo      | BOOLEAN      | DEFAULT true           | Soft delete flag    |
| created_at | TIMESTAMP    | NOT NULL DEFAULT NOW() | Data de criação     |
| updated_at | TIMESTAMP    | NOT NULL DEFAULT NOW() | Última atualização  |

## 3.2 Tabela: imoveis

Armazena os imóveis cadastrados.

|               |               |                             |                                   |
|---------------|---------------|-----------------------------|-----------------------------------|
| **Campo**     | **Tipo**      | **Restrições**              | **Descrição**                     |
| id            | BIGSERIAL     | PRIMARY KEY                 | Identificador único               |
| usuario_id    | BIGINT        | NOT NULL, FK → usuarios(id) | Dono do imóvel                    |
| endereco      | VARCHAR(300)  | NOT NULL                    | Endereço completo                 |
| cep           | VARCHAR(10)   | NOT NULL                    | CEP                               |
| cidade        | VARCHAR(100)  | NOT NULL                    | Cidade                            |
| estado        | VARCHAR(2)    | NOT NULL                    | UF                                |
| tipo          | VARCHAR(20)   | NOT NULL                    | CASA, APARTAMENTO, SALA_COMERCIAL |
| quartos       | INTEGER       | DEFAULT 0                   | Qtd quartos                       |
| banheiros     | INTEGER       | DEFAULT 0                   | Qtd banheiros                     |
| area_m2       | DECIMAL(10,2) | NULL                        | Área m²                           |
| valor_aluguel | DECIMAL(10,2) | NOT NULL                    | Valor mensal                      |
| status        | VARCHAR(20)   | NOT NULL                    | DISPONIVEL, ALUGADO, MANUTENCAO   |
| descricao     | TEXT          | NULL                        | Descrição                         |
| ativo         | BOOLEAN       | DEFAULT true                | Soft delete                       |
| created_at    | TIMESTAMP     | NOT NULL DEFAULT NOW()      | Criação                           |
| updated_at    | TIMESTAMP     | NOT NULL DEFAULT NOW()      | Atualização                       |

## 3.3 Tabela: inquilinos

Armazena os inquilinos.

|              |               |                             |                     |
|--------------|---------------|-----------------------------|---------------------|
| **Campo**    | **Tipo**      | **Restrições**              | **Descrição**       |
| id           | BIGSERIAL     | PRIMARY KEY                 | Identificador único |
| usuario_id   | BIGINT        | NOT NULL, FK → usuarios(id) | Quem cadastrou      |
| nome         | VARCHAR(200)  | NOT NULL                    | Nome completo       |
| cpf          | VARCHAR(14)   | NOT NULL                    | CPF formatado       |
| telefone     | VARCHAR(20)   | NOT NULL                    | Telefone            |
| email        | VARCHAR(200)  | NULL                        | E-mail              |
| renda_mensal | DECIMAL(10,2) | NULL                        | Renda mensal        |
| status       | VARCHAR(20)   | NOT NULL DEFAULT 'ATIVO'    | ATIVO ou INATIVO    |
| ativo        | BOOLEAN       | DEFAULT true                | Soft delete         |
| created_at   | TIMESTAMP     | NOT NULL DEFAULT NOW()      | Criação             |
| updated_at   | TIMESTAMP     | NOT NULL DEFAULT NOW()      | Atualização         |

## 3.4 Tabela: contratos

Vincula inquilino a imóvel.

|                |               |                               |                            |
|----------------|---------------|-------------------------------|----------------------------|
| **Campo**      | **Tipo**      | **Restrições**                | **Descrição**              |
| id             | BIGSERIAL     | PRIMARY KEY                   | Identificador único        |
| usuario_id     | BIGINT        | NOT NULL, FK → usuarios(id)   | Dono do contrato           |
| imovel_id      | BIGINT        | NOT NULL, FK → imoveis(id)    | Imóvel vinculado           |
| inquilino_id   | BIGINT        | NOT NULL, FK → inquilinos(id) | Inquilino vinculado        |
| valor_aluguel  | DECIMAL(10,2) | NOT NULL                      | Valor contratado           |
| data_inicio    | DATE          | NOT NULL                      | Início do contrato         |
| data_termino   | DATE          | NOT NULL                      | Término do contrato        |
| dia_vencimento | INTEGER       | NOT NULL                      | Dia pagamento (1-31)       |
| status         | VARCHAR(20)   | NOT NULL DEFAULT 'ATIVO'      | ATIVO, ENCERRADO, ATRASADO |
| observacoes    | TEXT          | NULL                          | Observações                |
| created_at     | TIMESTAMP     | NOT NULL DEFAULT NOW()        | Criação                    |
| updated_at     | TIMESTAMP     | NOT NULL DEFAULT NOW()        | Atualização                |

## 3.5 Tabela: pagamentos

Pagamentos mensais por contrato.

|                 |               |                              |                          |
|-----------------|---------------|------------------------------|--------------------------|
| **Campo**       | **Tipo**      | **Restrições**               | **Descrição**            |
| id              | BIGSERIAL     | PRIMARY KEY                  | Identificador único      |
| contrato_id     | BIGINT        | NOT NULL, FK → contratos(id) | Contrato relacionado     |
| mes_referencia  | DATE          | NOT NULL                     | Mês/ano referência       |
| valor_pago      | DECIMAL(10,2) | DEFAULT 0                    | Valor pago               |
| data_pagamento  | DATE          | NULL                         | Quando pagou             |
| data_vencimento | DATE          | NOT NULL                     | Vencimento               |
| status          | VARCHAR(20)   | NOT NULL DEFAULT 'PENDENTE'  | PAGO, PENDENTE, ATRASADO |
| forma_pagamento | VARCHAR(50)   | NULL                         | PIX, BOLETO, etc.        |
| observacoes     | TEXT          | NULL                         | Observações              |
| created_at      | TIMESTAMP     | NOT NULL DEFAULT NOW()       | Criação                  |
| updated_at      | TIMESTAMP     | NOT NULL DEFAULT NOW()       | Atualização              |

# 4. Índices

Para performance nas consultas mais frequentes:

|                           |            |                 |                        |
|---------------------------|------------|-----------------|------------------------|
| **Índice**                | **Tabela** | **Coluna(s)**   | **Motivo**             |
| idx_imoveis_usuario       | imoveis    | usuario_id      | Filtro por dono        |
| idx_imoveis_status        | imoveis    | status          | Filtro por status      |
| idx_inquilinos_usuario    | inquilinos | usuario_id      | Filtro por dono        |
| idx_inquilinos_cpf        | inquilinos | usuario_id, cpf | Unicidade CPF/usuário  |
| idx_contratos_usuario     | contratos  | usuario_id      | Filtro por dono        |
| idx_contratos_imovel      | contratos  | imovel_id       | Busca por imóvel       |
| idx_contratos_status      | contratos  | status          | Filtro por status      |
| idx_pagamentos_contrato   | pagamentos | contrato_id     | Pagamentos do contrato |
| idx_pagamentos_status     | pagamentos | status          | Filtro atrasados       |
| idx_pagamentos_vencimento | pagamentos | data_vencimento | Scheduler de atraso    |

# 5. Script SQL Completo (V1\_\_create_initial_tables.sql)

Este é o arquivo que Erick deve criar em src/main/resources/db/migration/:

> -- V1\_\_create_initial_tables.sql
 -- Alugix - Migration Inicial
 -- Autor: Erick
 -- ========== USUARIOS ==========
 CREATE TABLE usuarios (
 id BIGSERIAL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL,
 email VARCHAR(200) NOT NULL UNIQUE,
 senha VARCHAR(255) NOT NULL,
 perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN','USUARIO')),
 ativo BOOLEAN NOT NULL DEFAULT true,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 );
 -- ========== IMOVEIS ==========
 CREATE TABLE imoveis (
 id BIGSERIAL PRIMARY KEY,
 usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
 endereco VARCHAR(300) NOT NULL,
 cep VARCHAR(10) NOT NULL,
 cidade VARCHAR(100) NOT NULL,
 estado VARCHAR(2) NOT NULL,
 tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('CASA','APARTAMENTO','SALA_COMERCIAL')),
 quartos INTEGER NOT NULL DEFAULT 0,
 banheiros INTEGER NOT NULL DEFAULT 0,
 area_m2 DECIMAL(10,2),
 valor_aluguel DECIMAL(10,2) NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL'
 CHECK (status IN ('DISPONIVEL','ALUGADO','MANUTENCAO')),
 descricao TEXT,
 ativo BOOLEAN NOT NULL DEFAULT true,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 );
 -- ========== INQUILINOS ==========
 CREATE TABLE inquilinos (
 id BIGSERIAL PRIMARY KEY,
 usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
 nome VARCHAR(200) NOT NULL,
 cpf VARCHAR(14) NOT NULL,
 telefone VARCHAR(20) NOT NULL,
 email VARCHAR(200),
 renda_mensal DECIMAL(10,2),
 status VARCHAR(20) NOT NULL DEFAULT 'ATIVO'
 CHECK (status IN ('ATIVO','INATIVO')),
 ativo BOOLEAN NOT NULL DEFAULT true,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 );
 -- ========== CONTRATOS ==========
 CREATE TABLE contratos (
 id BIGSERIAL PRIMARY KEY,
 usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
 imovel_id BIGINT NOT NULL REFERENCES imoveis(id),
 inquilino_id BIGINT NOT NULL REFERENCES inquilinos(id),
 valor_aluguel DECIMAL(10,2) NOT NULL,
 data_inicio DATE NOT NULL,
 data_termino DATE NOT NULL,
 dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
 status VARCHAR(20) NOT NULL DEFAULT 'ATIVO'
 CHECK (status IN ('ATIVO','ENCERRADO','ATRASADO')),
 observacoes TEXT,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 );
 -- ========== PAGAMENTOS ==========
 CREATE TABLE pagamentos (
 id BIGSERIAL PRIMARY KEY,
 contrato_id BIGINT NOT NULL REFERENCES contratos(id),
 mes_referencia DATE NOT NULL,
 valor_pago DECIMAL(10,2) NOT NULL DEFAULT 0,
 data_pagamento DATE,
 data_vencimento DATE NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
 CHECK (status IN ('PAGO','PENDENTE','ATRASADO')),
 forma_pagamento VARCHAR(50),
 observacoes TEXT,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 );
 -- ========== INDICES ==========
 CREATE INDEX idx_imoveis_usuario ON imoveis(usuario_id);
 CREATE INDEX idx_imoveis_status ON imoveis(status);
 CREATE INDEX idx_inquilinos_usuario ON inquilinos(usuario_id);
 CREATE UNIQUE INDEX idx_inquilinos_cpf ON inquilinos(usuario_id, cpf);
 CREATE INDEX idx_contratos_usuario ON contratos(usuario_id);
 CREATE INDEX idx_contratos_imovel ON contratos(imovel_id);
 CREATE INDEX idx_contratos_status ON contratos(status);
 CREATE INDEX idx_pagamentos_contrato ON pagamentos(contrato_id);
 CREATE INDEX idx_pagamentos_status ON pagamentos(status);
 CREATE INDEX idx_pagamentos_vencimento ON pagamentos(data_vencimento);

# 6. Seed de Dados Iniciais (V2\_\_seed_admin.sql)

Cria o usuário administrador padrão para primeiro acesso:

> -- V2\_\_seed_admin.sql
 -- Senha: Admin@2026 (hash BCrypt)
 INSERT INTO usuarios (nome, email, senha, perfil, ativo)
 VALUES (
 'Administrador',
 'admin@alugix.com',
 '\$2a\$10\$N9qo8uLOickgx2ZMRZoMye.IjqkK5R1KqP5A8N1PmPtY7qR5THjWe',
 'ADMIN',
 true
 );

# 7. Convenções do Banco de Dados

- Nomes de tabelas: plural, snake_case (ex: imoveis, pagamentos)

- Nomes de colunas: snake_case (ex: valor_aluguel, data_inicio)

- Chaves primárias: sempre id (BIGSERIAL)

- Chaves estrangeiras: nome_da_tabela_id (ex: usuario_id, imovel_id)

- Timestamps: created_at e updated_at em TODAS as tabelas

- Soft delete: campo ativo (BOOLEAN) em vez de DELETE físico

- Enums: VARCHAR com CHECK constraint (não usar tipo ENUM nativo)

- Migrations: V{n}\_\_{descricao}.sql (ex: V1\_\_create_initial_tables.sql)

- Índices: idx\_{tabela}\_{coluna} (ex: idx_imoveis_status)

- Unique composto: idx\_{tabela}\_{colunas} (ex: idx_inquilinos_cpf)

*Fim do Modelo de Banco — Erick: copie o SQL da seção 5 para a migration!*
