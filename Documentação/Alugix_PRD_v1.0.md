**ALUGIX**

Sistema de Gerenciamento de Aluguéis

Product Requirements Document (PRD)

Documentação Funcional e Técnica Inicial

**Versão 1.0**

Data: Fevereiro de 2026

Status: Rascunho Inicial

*Stack Tecnológica: Java (Spring Boot) + Angular + PostgreSQL*

**Sumário**

# 1. Histórico de Revisões

# 2. Descrição Geral do Sistema

# 3. Objetivo do Produto

# 4. Público-Alvo

# 5. Requisitos Funcionais

  - 5.1 Módulo de Autenticação e Autorização
  - 5.2 Módulo de Imóveis (CRUD)
  - 5.3 Módulo de Inquilinos (CRUD)
  - 5.4 Módulo de Contratos
  - 5.5 Módulo de Relatórios e Dashboard

# 6. Requisitos Não Funcionais

# 7. Modelagem Inicial de Entidades

  - 7.1 Tabela: usuarios
  - 7.2 Tabela: imoveis
  - 7.3 Tabela: inquilinos
  - 7.4 Tabela: contratos
  - 7.5 Tabela: pagamentos
  - 7.6 Diagrama de Relacionamentos

# 8. Fluxos Principais do Sistema

  - 8.1 Fluxo de Cadastro de Imóvel
  - 8.2 Fluxo de Cadastro de Inquilino
  - 8.3 Fluxo de Criação de Contrato
  - 8.4 Fluxo de Registro de Pagamento
  - 8.5 Fluxo de Encerramento de Contrato

# 9. Estrutura de Permissões

# 10. Sugestão de Arquitetura

  - 10.1 Visão Geral
  - 10.2 Stack Tecnológica
  - 10.3 Estrutura de Pacotes (Back-End)
  - 10.4 Estrutura do Front-End (Angular)
  - 10.5 Diagrama de Arquitetura
  - 10.6 Padrões e Boas Práticas

# 11. Endpoints Principais da API REST

# 12. Considerações Futuras

# 13. Glossário

# 1. Histórico de Revisões

|            |            |                   |                              |
|------------|------------|-------------------|------------------------------|
| **Versão** | **Data**   | **Autor**         | **Descrição**                |
| 1.0        | 27/02/2026 | Equipe de Produto | Criação do documento inicial |

# 2. Descrição Geral do Sistema

O Alugix é uma aplicação web moderna desenvolvida para simplificar e centralizar o gerenciamento de aluguéis de imóveis. O sistema permite que investidores imobiliários que possuem múltiplos imóveis possam controlar de forma eficiente toda a operação de locação, desde o cadastro dos imóveis e inquilinos até o acompanhamento financeiro dos contratos de aluguel.

A plataforma será construída utilizando Java com Spring Boot no back-end e Angular no front-end, garantindo robustez, escalabilidade e uma experiência de usuário rica e responsiva. O sistema operará com dois perfis de acesso distintos (Administrador e Usuário Comum), proporcionando segurança e segmentação adequada dos dados.

# 3. Objetivo do Produto

O principal objetivo do Alugix é oferecer uma solução completa e intuitiva para investidores imobiliários gerenciarem seus imóveis, inquilinos e contratos de aluguel em uma única plataforma. Os objetivos específicos incluem:

- Centralizar o cadastro e gerenciamento de imóveis, inquilinos e contratos

- Automatizar o controle de vencimentos e pagamentos de aluguéis

- Fornecer visão consolidada da carteira imobiliária de cada usuário

- Reduzir erros operacionais e retrabalho no gerenciamento manual

- Permitir acompanhamento administrativo global por meio de perfil Admin

- Oferecer base sólida e escalável para adição de módulos futuros

# 4. Público-Alvo

O Alugix é destinado a:

- Investidores imobiliários com múltiplos imóveis que necessitam de controle centralizado

- Pequenas e médias imobiliárias que buscam uma ferramenta prática de gestão de locações

- Administradores de carteiras imobiliárias que precisam acompanhar contratos e pagamentos

- Profissionais autônomos do mercado imobiliário que gerenciam propriedades para terceiros

# 5. Requisitos Funcionais

A tabela abaixo lista os requisitos funcionais organizados por módulo:

## 5.1 Módulo de Autenticação e Autorização

|        |                                                                  |                |
|--------|------------------------------------------------------------------|----------------|
| **ID** | **Requisito**                                                    | **Prioridade** |
| RF-001 | O sistema deve permitir o login com e-mail e senha               | Alta           |
| RF-002 | O sistema deve implementar autenticação via JWT (JSON Web Token) | Alta           |
| RF-003 | O sistema deve diferenciar perfis Admin e Usuário Comum          | Alta           |
| RF-004 | O sistema deve permitir recuperação de senha via e-mail          | Média          |
| RF-005 | O Admin deve poder criar, editar e desativar usuários            | Alta           |
| RF-006 | O Admin deve poder atribuir e revogar permissões                 | Alta           |

## 5.2 Módulo de Imóveis (CRUD)

|        |                                                                                                      |                |
|--------|------------------------------------------------------------------------------------------------------|----------------|
| **ID** | **Requisito**                                                                                        | **Prioridade** |
| RF-010 | O usuário deve poder cadastrar um novo imóvel com endereço, tipo, quartos, banheiros, valor e status | Alta           |
| RF-011 | O usuário deve poder editar os dados de um imóvel existente                                          | Alta           |
| RF-012 | O usuário deve poder excluir um imóvel (exclusão lógica)                                             | Alta           |
| RF-013 | O usuário deve poder listar todos os seus imóveis com filtros e ordenação                            | Alta           |
| RF-014 | O sistema deve exibir o status do imóvel: Disponível, Alugado ou Manutenção                          | Alta           |
| RF-015 | O Admin deve poder visualizar imóveis de todos os usuários                                           | Alta           |
| RF-016 | O sistema deve validar campos obrigatórios no cadastro de imóvel                                     | Alta           |

## 5.3 Módulo de Inquilinos (CRUD)

|        |                                                                                          |                |
|--------|------------------------------------------------------------------------------------------|----------------|
| **ID** | **Requisito**                                                                            | **Prioridade** |
| RF-020 | O usuário deve poder cadastrar inquilino com nome, CPF, telefone, e-mail, renda e status | Alta           |
| RF-021 | O usuário deve poder editar os dados de um inquilino                                     | Alta           |
| RF-022 | O usuário deve poder desativar (exclusão lógica) um inquilino                            | Alta           |
| RF-023 | O usuário deve poder listar seus inquilinos com filtros                                  | Alta           |
| RF-024 | O sistema deve validar CPF único por usuário                                             | Alta           |
| RF-025 | O Admin deve poder visualizar inquilinos de todos os usuários                            | Alta           |

## 5.4 Módulo de Contratos

|        |                                                                                        |                |
|--------|----------------------------------------------------------------------------------------|----------------|
| **ID** | **Requisito**                                                                          | **Prioridade** |
| RF-030 | O usuário deve poder criar um contrato vinculando inquilino a imóvel                   | Alta           |
| RF-031 | O contrato deve conter: valor do aluguel, data início, data término, dia de vencimento | Alta           |
| RF-032 | O sistema deve controlar o status do contrato: Ativo, Encerrado, Atrasado              | Alta           |
| RF-033 | O usuário deve poder registrar pagamentos mensais                                      | Alta           |
| RF-034 | O sistema deve identificar automaticamente contratos com pagamentos atrasados          | Alta           |
| RF-035 | O usuário deve poder encerrar um contrato manualmente                                  | Média          |
| RF-036 | O sistema deve impedir vincular um inquilino a um imóvel já alugado                    | Alta           |
| RF-037 | Ao criar contrato, o status do imóvel deve mudar automaticamente para Alugado          | Alta           |
| RF-038 | Ao encerrar contrato, o status do imóvel deve voltar para Disponível                   | Alta           |

## 5.5 Módulo de Relatórios e Dashboard

|        |                                                                                                  |                |
|--------|--------------------------------------------------------------------------------------------------|----------------|
| **ID** | **Requisito**                                                                                    | **Prioridade** |
| RF-040 | O sistema deve exibir dashboard com resumo da carteira (total de imóveis, alugados, disponíveis) | Alta           |
| RF-041 | O sistema deve exibir total de receita mensal prevista e recebida                                | Média          |
| RF-042 | O sistema deve listar contratos com pagamento atrasado                                           | Alta           |
| RF-043 | O Admin deve visualizar relatórios gerais consolidados de todos os usuários                      | Média          |

# 6. Requisitos Não Funcionais

|         |                                                                            |                 |
|---------|----------------------------------------------------------------------------|-----------------|
| **ID**  | **Requisito**                                                              | **Categoria**   |
| RNF-001 | O sistema deve responder a requisições em até 2 segundos sob carga normal  | Desempenho      |
| RNF-002 | O sistema deve suportar até 500 usuários simultâneos na versão inicial     | Escalabilidade  |
| RNF-003 | As senhas devem ser armazenadas com hash BCrypt                            | Segurança       |
| RNF-004 | Toda comunicação deve ser via HTTPS/TLS                                    | Segurança       |
| RNF-005 | O sistema deve ser compatível com Chrome, Firefox, Edge e Safari           | Compatibilidade |
| RNF-006 | O front-end deve ser responsivo (desktop, tablet, mobile)                  | Usabilidade     |
| RNF-007 | O sistema deve ter cobertura mínima de 80% de testes unitários no back-end | Qualidade       |
| RNF-008 | O sistema deve possuir logs estruturados para auditoria                    | Observabilidade |
| RNF-009 | O banco de dados deve ser relacional (PostgreSQL)                          | Infraestrutura  |
| RNF-010 | O sistema deve implementar CORS configurado corretamente                   | Segurança       |
| RNF-011 | A API deve seguir o padrão RESTful com versionamento                       | Padrões         |
| RNF-012 | O sistema deve utilizar migrations para controle de schema do banco        | Mantenabilidade |

# 7. Modelagem Inicial de Entidades

Esta seção apresenta a modelagem inicial das tabelas do banco de dados PostgreSQL. Todas as entidades utilizam exclusão lógica (soft delete) e campos de auditoria.

## 7.1 Tabela: usuarios

Armazena os dados dos usuários do sistema (Admin e Usuário Comum).

|            |              |                  |                            |
|------------|--------------|------------------|----------------------------|
| **Campo**  | **Tipo**     | **Restrições**   | **Descrição**              |
| id         | BIGINT (PK)  | AUTO_INCREMENT   | Identificador único        |
| nome       | VARCHAR(150) | NOT NULL         | Nome completo              |
| email      | VARCHAR(200) | NOT NULL, UNIQUE | E-mail de acesso           |
| senha      | VARCHAR(255) | NOT NULL         | Hash BCrypt da senha       |
| perfil     | ENUM         | NOT NULL         | ADMIN ou USUARIO           |
| ativo      | BOOLEAN      | DEFAULT true     | Status do usuário          |
| created_at | TIMESTAMP    | NOT NULL         | Data de criação            |
| updated_at | TIMESTAMP    | NOT NULL         | Data da última atualização |

## 7.2 Tabela: imoveis

Armazena os dados dos imóveis cadastrados no sistema.

|               |               |                |                                   |
|---------------|---------------|----------------|-----------------------------------|
| **Campo**     | **Tipo**      | **Restrições** | **Descrição**                     |
| id            | BIGINT (PK)   | AUTO_INCREMENT | Identificador único               |
| usuario_id    | BIGINT (FK)   | NOT NULL       | Referência ao proprietário        |
| endereco      | VARCHAR(300)  | NOT NULL       | Endereço completo                 |
| cep           | VARCHAR(10)   | NOT NULL       | CEP do imóvel                     |
| cidade        | VARCHAR(100)  | NOT NULL       | Cidade                            |
| estado        | VARCHAR(2)    | NOT NULL       | UF (sigla)                        |
| tipo          | ENUM          | NOT NULL       | CASA, APARTAMENTO, SALA_COMERCIAL |
| quartos       | INTEGER       | DEFAULT 0      | Quantidade de quartos             |
| banheiros     | INTEGER       | DEFAULT 0      | Quantidade de banheiros           |
| area_m2       | DECIMAL(10,2) | NULL           | Área em metros quadrados          |
| valor_aluguel | DECIMAL(10,2) | NOT NULL       | Valor mensal do aluguel           |
| status        | ENUM          | NOT NULL       | DISPONIVEL, ALUGADO, MANUTENCAO   |
| descricao     | TEXT          | NULL           | Descrição adicional               |
| ativo         | BOOLEAN       | DEFAULT true   | Soft delete flag                  |
| created_at    | TIMESTAMP     | NOT NULL       | Data de criação                   |
| updated_at    | TIMESTAMP     | NOT NULL       | Última atualização                |

## 7.3 Tabela: inquilinos

Armazena os dados dos inquilinos.

|              |               |                |                        |
|--------------|---------------|----------------|------------------------|
| **Campo**    | **Tipo**      | **Restrições** | **Descrição**          |
| id           | BIGINT (PK)   | AUTO_INCREMENT | Identificador único    |
| usuario_id   | BIGINT (FK)   | NOT NULL       | Usuário que cadastrou  |
| nome         | VARCHAR(200)  | NOT NULL       | Nome completo          |
| cpf          | VARCHAR(14)   | NOT NULL       | CPF do inquilino       |
| telefone     | VARCHAR(20)   | NOT NULL       | Telefone de contato    |
| email        | VARCHAR(200)  | NULL           | E-mail do inquilino    |
| renda_mensal | DECIMAL(10,2) | NULL           | Renda mensal declarada |
| status       | ENUM          | NOT NULL       | ATIVO ou INATIVO       |
| ativo        | BOOLEAN       | DEFAULT true   | Soft delete flag       |
| created_at   | TIMESTAMP     | NOT NULL       | Data de criação        |
| updated_at   | TIMESTAMP     | NOT NULL       | Última atualização     |

## 7.4 Tabela: contratos

Armazena os contratos de aluguel vinculando inquilinos a imóveis.

|                |               |                |                                  |
|----------------|---------------|----------------|----------------------------------|
| **Campo**      | **Tipo**      | **Restrições** | **Descrição**                    |
| id             | BIGINT (PK)   | AUTO_INCREMENT | Identificador único              |
| usuario_id     | BIGINT (FK)   | NOT NULL       | Proprietário do contrato         |
| imovel_id      | BIGINT (FK)   | NOT NULL       | Imóvel vinculado                 |
| inquilino_id   | BIGINT (FK)   | NOT NULL       | Inquilino vinculado              |
| valor_aluguel  | DECIMAL(10,2) | NOT NULL       | Valor contratado                 |
| data_inicio    | DATE          | NOT NULL       | Início do contrato               |
| data_termino   | DATE          | NOT NULL       | Término do contrato              |
| dia_vencimento | INTEGER       | NOT NULL       | Dia do mês para pagamento (1-31) |
| status         | ENUM          | NOT NULL       | ATIVO, ENCERRADO, ATRASADO       |
| observacoes    | TEXT          | NULL           | Observações adicionais           |
| created_at     | TIMESTAMP     | NOT NULL       | Data de criação                  |
| updated_at     | TIMESTAMP     | NOT NULL       | Última atualização               |

## 7.5 Tabela: pagamentos

Registra os pagamentos realizados para cada contrato.

|                 |               |                |                                       |
|-----------------|---------------|----------------|---------------------------------------|
| **Campo**       | **Tipo**      | **Restrições** | **Descrição**                         |
| id              | BIGINT (PK)   | AUTO_INCREMENT | Identificador único                   |
| contrato_id     | BIGINT (FK)   | NOT NULL       | Contrato relacionado                  |
| mes_referencia  | DATE          | NOT NULL       | Mês/ano de referência                 |
| valor_pago      | DECIMAL(10,2) | NOT NULL       | Valor efetivamente pago               |
| data_pagamento  | DATE          | NULL           | Data em que o pagamento foi realizado |
| data_vencimento | DATE          | NOT NULL       | Data de vencimento deste pagamento    |
| status          | ENUM          | NOT NULL       | PAGO, PENDENTE, ATRASADO              |
| forma_pagamento | VARCHAR(50)   | NULL           | PIX, transferência, boleto etc.       |
| observacoes     | TEXT          | NULL           | Observações                           |
| created_at      | TIMESTAMP     | NOT NULL       | Data de criação                       |
| updated_at      | TIMESTAMP     | NOT NULL       | Última atualização                    |

## 7.6 Diagrama de Relacionamentos

Os relacionamentos entre as entidades são:

- usuarios (1:N) imoveis — Um usuário possui muitos imóveis

- usuarios (1:N) inquilinos — Um usuário cadastra muitos inquilinos

- usuarios (1:N) contratos — Um usuário possui muitos contratos

- imoveis (1:N) contratos — Um imóvel pode ter vários contratos (apenas um ativo por vez)

- inquilinos (1:N) contratos — Um inquilino pode ter vários contratos ao longo do tempo

- contratos (1:N) pagamentos — Um contrato possui vários registros de pagamento

# 8. Fluxos Principais do Sistema

## 8.1 Fluxo de Cadastro de Imóvel

1\. Usuário acessa a tela de imóveis e clica em "Novo Imóvel"

2\. Sistema exibe formulário com campos: endereço, CEP, cidade, estado, tipo, quartos, banheiros, área, valor do aluguel e descrição

3\. Usuário preenche os dados e submete o formulário

4\. Front-end (Angular) realiza validação dos campos obrigatórios

5\. Back-end (Spring Boot) valida regras de negócio e persiste no banco de dados

6\. Sistema retorna confirmação e redireciona para a listagem de imóveis

## 8.2 Fluxo de Cadastro de Inquilino

1\. Usuário acessa a tela de inquilinos e clica em "Novo Inquilino"

2\. Sistema exibe formulário com campos: nome, CPF, telefone, e-mail e renda mensal

3\. Usuário preenche e submete o formulário

4\. Front-end valida formato do CPF e campos obrigatórios

5\. Back-end valida unicidade do CPF dentro da carteira do usuário

6\. Sistema persiste os dados e confirma a operação

## 8.3 Fluxo de Criação de Contrato

1\. Usuário acessa a tela de contratos e clica em "Novo Contrato"

2\. Sistema exibe lista de imóveis com status "Disponível" para seleção

3\. Usuário seleciona o imóvel e em seguida o inquilino

4\. Usuário define: valor do aluguel, data de início, data de término e dia de vencimento

5\. Back-end valida que o imóvel está disponível e que o inquilino está ativo

6\. Sistema cria o contrato e atualiza o status do imóvel para "Alugado"

7\. Sistema gera automaticamente os registros de pagamento pendentes para cada mês do contrato

## 8.4 Fluxo de Registro de Pagamento

1\. Usuário acessa o contrato e visualiza a lista de pagamentos

2\. Usuário seleciona um pagamento pendente e clica em "Registrar Pagamento"

3\. Usuário informa: valor pago, data do pagamento e forma de pagamento

4\. Sistema atualiza o status do pagamento para "Pago"

5\. Se todos os pagamentos do mês estão em dia, contrato permanece "Ativo"

6\. Se há pagamentos vencidos sem registro, sistema marca o contrato como "Atrasado"

## 8.5 Fluxo de Encerramento de Contrato

1\. Usuário acessa o contrato ativo e clica em "Encerrar Contrato"

2\. Sistema solicita confirmação da operação

3\. Usuário confirma o encerramento

4\. Sistema atualiza o status do contrato para "Encerrado"

5\. Sistema atualiza o status do imóvel para "Disponível"

6\. Pagamentos pendentes são mantidos para referência histórica

# 9. Estrutura de Permissões

O sistema opera com dois perfis de acesso distintos, cada um com permissões específicas:

|                                              |           |                   |
|----------------------------------------------|-----------|-------------------|
| **Funcionalidade**                           | **Admin** | **Usuário Comum** |
| Gerenciar usuários (CRUD)                    | ✅ Sim    | ❌ Não            |
| Atribuir/revogar permissões                  | ✅ Sim    | ❌ Não            |
| Visualizar imóveis de todos os usuários      | ✅ Sim    | ❌ Não            |
| Visualizar contratos de todos os usuários    | ✅ Sim    | ❌ Não            |
| Visualizar relatórios gerais consolidados    | ✅ Sim    | ❌ Não            |
| Cadastrar/editar/excluir imóveis próprios    | ✅ Sim    | ✅ Sim            |
| Cadastrar/editar/excluir inquilinos próprios | ✅ Sim    | ✅ Sim            |
| Criar e gerenciar contratos próprios         | ✅ Sim    | ✅ Sim            |
| Registrar pagamentos próprios                | ✅ Sim    | ✅ Sim            |
| Visualizar dashboard da própria carteira     | ✅ Sim    | ✅ Sim            |

## 9.1 Regras de Isolamento de Dados

- Usuário Comum acessa exclusivamente dados vinculados ao seu próprio ID (multi-tenancy lógico)

- Admin tem visibilidade global, podendo filtrar por usuário específico

- Toda requisição ao back-end deve incluir o token JWT com o perfil do usuário

- O back-end deve implementar filtros automáticos baseados no usuario_id do token

- Operações de escrita são sempre vinculadas ao usuário autenticado

# 10. Sugestão de Arquitetura

## 10.1 Visão Geral

A arquitetura proposta segue o padrão de aplicação web moderna com separação entre front-end SPA (Single Page Application) e back-end API RESTful, comunicação via HTTP/JSON.

## 10.2 Stack Tecnológica

### Front-End

|                        |                     |                            |
|------------------------|---------------------|----------------------------|
| **Tecnologia**         | **Versão Sugerida** | **Finalidade**             |
| Angular                | 17+                 | Framework SPA principal    |
| Angular Material       | Última compatível   | Componentes de UI/UX       |
| TypeScript             | 5.x                 | Linguagem base do Angular  |
| RxJS                   | 7.x                 | Programação reativa        |
| NgRx (opcional)        | 17+                 | Gerenciamento de estado    |
| Angular Router         | Nativo              | Navegação e guards de rota |
| Chart.js ou ngx-charts | \-                  | Gráficos no dashboard      |

### Back-End

|                 |                     |                                       |
|-----------------|---------------------|---------------------------------------|
| **Tecnologia**  | **Versão Sugerida** | **Finalidade**                        |
| Java            | 21 (LTS)            | Linguagem principal do back-end       |
| Spring Boot     | 3.2+                | Framework base da aplicação           |
| Spring Security | 6.x                 | Autenticação e autorização (JWT)      |
| Spring Data JPA | 3.x                 | Acesso a dados e repositórios         |
| Hibernate       | 6.x                 | ORM (Object-Relational Mapping)       |
| Flyway          | Última              | Migrations do banco de dados          |
| Maven ou Gradle | \-                  | Gerenciamento de dependências e build |
| Lombok          | \-                  | Redução de boilerplate                |
| MapStruct       | \-                  | Mapeamento DTO ↔ Entity               |
| Swagger/OpenAPI | 3.x                 | Documentação da API                   |

### Banco de Dados e Infraestrutura

|                           |                                                   |
|---------------------------|---------------------------------------------------|
| **Tecnologia**            | **Finalidade**                                    |
| PostgreSQL 16             | Banco de dados relacional principal               |
| Redis (futuro)            | Cache de sessões e dados frequentes               |
| Docker                    | Containerização da aplicação                      |
| Docker Compose            | Orquestração do ambiente de desenvolvimento       |
| Nginx                     | Proxy reverso e servidor do front-end em produção |
| GitHub Actions ou Jenkins | CI/CD                                             |

## 10.3 Estrutura de Pacotes do Back-End (Spring Boot)

Organização sugerida seguindo arquitetura em camadas:

**com.alugix**

- ├── config/ — Configurações (Security, CORS, Swagger)

- ├── controller/ — Controllers REST (endpoints da API)

- ├── dto/ — Data Transfer Objects (request/response)

- ├── entity/ — Entidades JPA (mapeamento das tabelas)

- ├── enums/ — Enumerações (StatusImovel, Perfil, etc.)

- ├── exception/ — Exceções customizadas e GlobalExceptionHandler

- ├── mapper/ — MapStruct mappers (DTO ↔ Entity)

- ├── repository/ — Interfaces Spring Data JPA

- ├── security/ — JWT, filtros de segurança, UserDetailsService

- ├── service/ — Lógica de negócio

- └── util/ — Classes utilitárias

## 10.4 Estrutura do Front-End (Angular)

Organização sugerida por módulos:

**src/app/**

- ├── core/ — Guards, interceptors, serviços globais (AuthService, TokenInterceptor)

- ├── shared/ — Componentes, pipes e diretivas reutilizáveis

- ├── features/

<!-- -->

- ├── auth/ — Login, recuperação de senha

- ├── dashboard/ — Página principal com resumos

- ├── imoveis/ — CRUD de imóveis

- ├── inquilinos/ — CRUD de inquilinos

- ├── contratos/ — Gestão de contratos e pagamentos

- └── admin/ — Gestão de usuários e relatórios (apenas Admin)

<!-- -->

- ├── models/ — Interfaces TypeScript (modelos de dados)

- └── environments/ — Configurações por ambiente

## 10.5 Diagrama de Arquitetura (Alto Nível)

**\[Navegador/Cliente\]**

↓ HTTPS

**\[Angular SPA (Nginx)\]**

↓ HTTP/JSON (REST API)

**\[Spring Boot API\]**

├── Spring Security (JWT) → Autenticação/Autorização

├── Controllers → Services → Repositories

└── Flyway → Migrations

↓ JDBC

**\[PostgreSQL\]**

## 10.6 Padrões e Boas Práticas

- Utilizar DTOs para transferência de dados entre front-end e back-end

- Implementar Global Exception Handler com @ControllerAdvice

- Utilizar paginação (Pageable) em todas as listagens

- Implementar auditoria automática com @CreatedDate e @LastModifiedDate

- Validar dados de entrada com Bean Validation (@Valid, @NotNull, @Size)

- Documentar todos os endpoints com Swagger/OpenAPI

- Utilizar Angular Reactive Forms com validações customizadas

- Implementar interceptors HTTP no Angular para inclusão automática do token JWT

# 11. Endpoints Principais da API REST

Todos seguem o padrão /api/v1/.

## 11.1 Autenticação

|            |                              |                                |             |
|------------|------------------------------|--------------------------------|-------------|
| **Método** | **Endpoint**                 | **Descrição**                  | **Acesso**  |
| POST       | /api/v1/auth/login           | Realizar login                 | Público     |
| POST       | /api/v1/auth/refresh         | Renovar token JWT              | Autenticado |
| POST       | /api/v1/auth/forgot-password | Solicitar recuperação de senha | Público     |

## 11.2 Usuários (Admin)

|            |                       |                   |            |
|------------|-----------------------|-------------------|------------|
| **Método** | **Endpoint**          | **Descrição**     | **Acesso** |
| GET        | /api/v1/usuarios      | Listar usuários   | Admin      |
| POST       | /api/v1/usuarios      | Criar usuário     | Admin      |
| PUT        | /api/v1/usuarios/{id} | Editar usuário    | Admin      |
| DELETE     | /api/v1/usuarios/{id} | Desativar usuário | Admin      |

## 11.3 Imóveis

|            |                      |                           |             |
|------------|----------------------|---------------------------|-------------|
| **Método** | **Endpoint**         | **Descrição**             | **Acesso**  |
| GET        | /api/v1/imoveis      | Listar imóveis do usuário | Autenticado |
| GET        | /api/v1/imoveis/{id} | Detalhar imóvel           | Autenticado |
| POST       | /api/v1/imoveis      | Cadastrar imóvel          | Autenticado |
| PUT        | /api/v1/imoveis/{id} | Editar imóvel             | Autenticado |
| DELETE     | /api/v1/imoveis/{id} | Excluir imóvel (lógico)   | Autenticado |

## 11.4 Inquilinos

|            |                         |                              |             |
|------------|-------------------------|------------------------------|-------------|
| **Método** | **Endpoint**            | **Descrição**                | **Acesso**  |
| GET        | /api/v1/inquilinos      | Listar inquilinos do usuário | Autenticado |
| GET        | /api/v1/inquilinos/{id} | Detalhar inquilino           | Autenticado |
| POST       | /api/v1/inquilinos      | Cadastrar inquilino          | Autenticado |
| PUT        | /api/v1/inquilinos/{id} | Editar inquilino             | Autenticado |
| DELETE     | /api/v1/inquilinos/{id} | Desativar inquilino          | Autenticado |

## 11.5 Contratos

|            |                                 |                             |             |
|------------|---------------------------------|-----------------------------|-------------|
| **Método** | **Endpoint**                    | **Descrição**               | **Acesso**  |
| GET        | /api/v1/contratos               | Listar contratos do usuário | Autenticado |
| GET        | /api/v1/contratos/{id}          | Detalhar contrato           | Autenticado |
| POST       | /api/v1/contratos               | Criar contrato              | Autenticado |
| PUT        | /api/v1/contratos/{id}          | Editar contrato             | Autenticado |
| PATCH      | /api/v1/contratos/{id}/encerrar | Encerrar contrato           | Autenticado |

## 11.6 Pagamentos

|            |                                   |                                  |             |
|------------|-----------------------------------|----------------------------------|-------------|
| **Método** | **Endpoint**                      | **Descrição**                    | **Acesso**  |
| GET        | /api/v1/contratos/{id}/pagamentos | Listar pagamentos de um contrato | Autenticado |
| PATCH      | /api/v1/pagamentos/{id}/pagar     | Registrar pagamento              | Autenticado |

# 12. Considerações Futuras

O Alugix foi projetado com uma arquitetura modular que permite a adição de funcionalidades futuras sem grandes refatorações:

|                         |                                                                       |                |
|-------------------------|-----------------------------------------------------------------------|----------------|
| **Módulo**              | **Descrição**                                                         | **Prioridade** |
| Notificações por E-mail | Alertas automáticos de vencimento, atraso e renovação de contrato     | Alta           |
| Relatórios Avançados    | Relatórios de inadimplência, rentabilidade por imóvel, fluxo de caixa | Alta           |
| Gestão de Despesas      | Registro de despesas do imóvel (IPTU, condomínio, manutenção)         | Média          |
| Upload de Documentos    | Anexar contratos, comprovantes e fotos dos imóveis                    | Média          |
| Reajuste Automático     | Cálculo automático de reajuste por índice (IGPM, IPCA)                | Média          |
| App Mobile              | Versão mobile nativa ou PWA para acesso em campo                      | Baixa          |
| Integração Bancária     | Geração de boletos e PIX automáticos                                  | Baixa          |
| Portal do Inquilino     | Acesso para o inquilino visualizar contrato e pagamentos              | Baixa          |
| Multi-Tenancy Avançado  | Suporte a imobiliárias com múltiplos administradores                  | Baixa          |
| Assinatura Digital      | Integração com plataformas de assinatura eletrônica                   | Baixa          |

# 13. Glossário

|               |                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------|
| **Termo**     | **Definição**                                                                                 |
| SPA           | Single Page Application – Aplicação web que carrega uma única página e atualiza dinamicamente |
| JWT           | JSON Web Token – Padrão de token para autenticação stateless                                  |
| DTO           | Data Transfer Object – Objeto para transferência de dados entre camadas                       |
| ORM           | Object-Relational Mapping – Técnica de mapeamento entre objetos e tabelas                     |
| CRUD          | Create, Read, Update, Delete – Operações básicas de manipulação de dados                      |
| REST          | Representational State Transfer – Estilo arquitetural para APIs web                           |
| Soft Delete   | Exclusão lógica – Marca registro como inativo sem remover do banco                            |
| Multi-Tenancy | Isolamento de dados entre diferentes usuários/organizações                                    |

*Fim do Documento*
