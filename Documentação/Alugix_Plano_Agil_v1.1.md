**ALUGIX**

Plano de Projeto Ágil

Guia Completo: Do Zero ao Deploy

Instalação → Configuração → Desenvolvimento por Sprints

**Versão 1.1 — Fevereiro de 2026**

Ambiente: Windows 10/11 + VS Code

**EQUIPE DE DESENVOLVIMENTO**

**Erick** — Desenvolvedor Back-End (Java / Spring Boot)

**Welton** — Desenvolvedor Front-End (Angular / TypeScript)

*Scrum • Sprints de 2 semanas • ~20 semanas*

*Java 21 + Spring Boot 3 + Angular 17 + PostgreSQL 16*

**Sumário**

# 1. Visão Geral do Plano

# 2. Equipe e Responsabilidades

# 3. Metodologia Ágil

# 4. Fase 0 — Preparação do Ambiente (Ambos)

  - 4.1 Java 21 (JDK)
  - 4.2 Apache Maven
  - 4.3 Node.js e npm
  - 4.4 Angular CLI
  - 4.5 PostgreSQL 16
  - 4.6 Git
  - 4.7 VS Code + Extensões
  - 4.8 Docker (Opcional)
  - 4.9 Checklist de Validação

# 5. Fase 1 — Estruturação dos Projetos

  - 5.1 Projeto Spring Boot — Erick
  - 5.2 Projeto Angular — Welton
  - 5.3 Banco de Dados — Erick
  - 5.4 Repositório Git — Ambos

# 6. Product Backlog com Responsabilidades

# 7. Sprint 0 — Fundamentos

# 8. Sprint 1 — Autenticação

# 9. Sprint 2 — CRUD de Imóveis

# 10. Sprint 3 — CRUD de Inquilinos

# 11. Sprint 4 — Contratos

# 12. Sprint 5 — Pagamentos

# 13. Sprint 6 — Dashboard

# 14. Sprint 7 — Admin

# 15. Sprint 8 — Testes e Polimento

# 16. Sprint 9 — Deploy

# 17. Definição de Pronto (DoD)

# 18. Cronograma Resumido

# 1. Visão Geral do Plano

Este documento é o guia completo para construir o Alugix do zero em Windows 10/11 usando VS Code. O desenvolvimento será realizado por uma equipe de 2 pessoas com responsabilidades claras e paralelas.

| **Item**            | **Detalhe**                                       |
|---------------------|---------------------------------------------------|
| Equipe              | 2 desenvolvedores (Erick + Welton)                |
| Sistema Operacional | Windows 10/11                                     |
| IDE                 | VS Code (ambos)                                   |
| Metodologia         | Scrum (Sprints de 2 semanas)                      |
| Duração estimada    | 10 sprints (~20 semanas / 5 meses)                |
| Back-End (Erick)    | Java 21 + Spring Boot 3.2 + Spring Security + JPA |
| Front-End (Welton)  | Angular 17+ + Angular Material + TypeScript       |
| Banco de Dados      | PostgreSQL 16                                     |

# 2. Equipe e Responsabilidades

O projeto é dividido em duas frentes paralelas. Ambos instalam o mesmo ambiente, mas cada um foca na sua área de domínio:

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

## 2.1 Erick — Desenvolvedor Back-End

Erick é responsável por toda a camada servidor da aplicação:

- Criar e manter o projeto Spring Boot (alugix-api)

- Modelar e criar as tabelas do banco de dados (migrations Flyway)

- Implementar as entidades JPA, repositórios, services e controllers

- Implementar autenticação JWT com Spring Security

- Criar e documentar todos os endpoints da API REST (Swagger)

- Implementar validações de negócio e tratamento de erros

- Escrever testes unitários e de integração (JUnit + Mockito)

- Configurar Docker e CI/CD para o back-end

## 2.2 Welton — Desenvolvedor Front-End

Welton é responsável por toda a interface visual e experiência do usuário:

- Criar e manter o projeto Angular (alugix-web)

- Construir o layout principal (sidebar, toolbar, navegação)

- Implementar todas as telas: login, dashboard, CRUDs, admin

- Criar formulários reativos com validações e máscaras

- Implementar AuthService, guards de rota e interceptor JWT

- Consumir a API REST criada pelo Erick

- Garantir responsividade (desktop, tablet, mobile)

- Configurar Nginx e build de produção do Angular

## 2.3 Responsabilidades Compartilhadas

Algumas atividades são de responsabilidade de ambos:

- Instalação e configuração do ambiente de desenvolvimento (Fase 0)

- Definir e manter o contrato da API (endpoints, DTOs, códigos de erro)

- Participar das cerimônias Scrum (planning, daily, review, retro)

- Code review cruzado (Erick revisa front, Welton revisa back)

- Manter o repositório Git organizado (branches, PRs, commits)

- Testes de integração end-to-end (front + back comunicando)

## 2.4 Fluxo de Trabalho Paralelo

O trabalho em cada sprint segue este fluxo:

**1. Erick** cria os endpoints da API REST e documenta no Swagger

**2. Welton** consulta o Swagger e desenvolve as telas consumindo a API

**3. Ambos** fazem integração e testam o fluxo completo juntos

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>💡 IMPORTÂNCIA DO CONTRATO DA API</strong></p>
<p>No início de cada sprint, Erick e Welton devem alinhar o contrato da API (URLs, métodos HTTP, formato dos DTOs). Assim, Welton pode iniciar o front-end com mocks enquanto Erick implementa o back-end real. O Swagger será a fonte de verdade.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 3. Metodologia Ágil

O projeto utiliza Scrum adaptado para uma equipe de 2 pessoas:

- Sprints de 2 semanas com entrega funcional ao final

- Cada sprint tem tarefas paralelas: Erick (back) e Welton (front)

- Integração no final de cada sprint para testar end-to-end

| **Cerimônia**      | **Frequência**   | **Duração** | **Participantes** |
|--------------------|------------------|-------------|-------------------|
| Sprint Planning    | Início da sprint | 1h          | Erick + Welton    |
| Daily Standup      | Diário           | 15min       | Erick + Welton    |
| Alinhamento de API | Início da sprint | 30min       | Erick + Welton    |
| Sprint Review      | Final da sprint  | 1h          | Erick + Welton    |
| Retrospectiva      | Final da sprint  | 30min       | Erick + Welton    |

# 4. Fase 0 — Preparação do Ambiente (Ambos)

Esta fase é realizada por AMBOS os desenvolvedores nas suas próprias máquinas. Erick e Welton devem instalar todas as ferramentas, pois precisam rodar o projeto completo localmente.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>⚠️ IMPORTANTE</strong></p>
<p>Ambos instalam TUDO. Mesmo que Erick foque no back-end, ele precisa do Angular para rodar o front localmente. Mesmo que Welton foque no front-end, ele precisa do Java e PostgreSQL para rodar a API localmente.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 4.1 Instalação do Java 21 (JDK)

O JDK 21 é a versão LTS usada pelo Spring Boot 3.

**Passo 1 — Download:**

- Acesse: https://adoptium.net/temurin/releases/

- Selecione: JDK 21 → Windows → x64 → .msi

**Passo 2 — Instalação:**

- Execute o .msi baixado

- MARQUE: "Set JAVA_HOME variable"

- MARQUE: "Add to PATH"

**Passo 3 — Verificação (reabra o PowerShell):**

> java -version
 javac -version

Esperado: openjdk version "21.x.x"

## 4.2 Instalação do Apache Maven

- Acesse: https://maven.apache.org/download.cgi

- Baixe: apache-maven-3.9.x-bin.zip

- Extraia em: C:\tools\apache-maven-3.9.x

**Configurar variáveis (PowerShell como Admin):**

> \[System.Environment\]::SetEnvironmentVariable('MAVEN_HOME', 'C:\tools\apache-maven-3.9.x', 'Machine')
 \$path = \[System.Environment\]::GetEnvironmentVariable('Path', 'Machine')
 \[System.Environment\]::SetEnvironmentVariable('Path', \$path + ';C:\tools\apache-maven-3.9.x\bin', 'Machine')

**Verificação:**

> mvn -version \# Esperado: Maven 3.9.x, Java 21

## 4.3 Instalação do Node.js e npm

- Acesse: https://nodejs.org/ → LTS (v20.x ou superior)

- Execute o instalador .msi (npm incluso)

> node -v \# Esperado: v20.x.x
 npm -v \# Esperado: 10.x.x

## 4.4 Instalação do Angular CLI

> npm install -g @angular/cli
 ng version \# Esperado: Angular CLI: 17.x.x

## 4.5 Instalação do PostgreSQL 16

- Acesse: https://www.postgresql.org/download/windows/

- Baixe o instalador EDB e execute

- Defina a senha do usuário postgres (ANOTEM!)

- Porta: 5432 (padrão) — Instale o pgAdmin 4

**Criar banco do projeto:**

> psql -U postgres
 CREATE DATABASE alugix_db;
 CREATE USER alugix_user WITH ENCRYPTED PASSWORD 'alugix@2026';
 GRANT ALL PRIVILEGES ON DATABASE alugix_db TO alugix_user;
 ALTER DATABASE alugix_db OWNER TO alugix_user;
 \q

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>💡 DICA</strong></p>
<p>Se psql não for encontrado, adicionem ao PATH: C:\Program Files\PostgreSQL\16\bin</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 4.6 Instalação do Git

- Acesse: https://git-scm.com/download/win → instale (padrões)

**Cada um configura com seus dados:**

> git config --global user.name "Seu Nome"
 git config --global user.email "seu@email.com"
 git config --global init.defaultBranch main

## 4.7 VS Code + Extensões

- Acesse: https://code.visualstudio.com/ → instale (marque "Add to PATH")

**Extensões que AMBOS devem instalar:**

| **Extensão**               | **Publisher**   | **Necessário para**                     |
|----------------------------|-----------------|-----------------------------------------|
| Extension Pack for Java    | Microsoft       | Erick (essencial) + Welton (rodar API)  |
| Spring Boot Extension Pack | VMware          | Erick (essencial) + Welton (rodar API)  |
| Lombok Annotations Support | Microsoft       | Erick (essencial)                       |
| Angular Language Service   | Angular         | Welton (essencial) + Erick (visualizar) |
| Angular Snippets           | John Papa       | Welton (essencial)                      |
| ESLint                     | Microsoft       | Welton (essencial)                      |
| Prettier                   | Prettier        | Ambos                                   |
| GitLens                    | GitKraken       | Ambos                                   |
| Thunder Client             | Ranga Vadhineni | Erick (testar API) + Welton (debug)     |
| Database Client            | Weijan Chen     | Erick (essencial) + Welton (útil)       |

**Instalação rápida (ambos executam):**

> code --install-extension vscjava.vscode-java-pack
 code --install-extension vmware.vscode-boot-dev-pack
 code --install-extension Angular.ng-template
 code --install-extension johnpapa.Angular2
 code --install-extension dbaeumer.vscode-eslint
 code --install-extension esbenp.prettier-vscode
 code --install-extension eamodio.gitlens
 code --install-extension rangav.vscode-thunder-client

## 4.8 Docker Desktop (Opcional)

- Acesse: https://www.docker.com/products/docker-desktop → instale

**PostgreSQL via Docker (alternativa à instalação nativa):**

> docker run -d --name alugix-postgres ^
 -e POSTGRES_DB=alugix_db ^
 -e POSTGRES_USER=alugix_user ^
 -e POSTGRES_PASSWORD=alugix@2026 ^
 -p 5432:5432 postgres:16

## 4.9 Checklist de Validação (Ambos devem passar)

| **\#** | **Comando**                      | **Resultado Esperado** | **Erick** | **Welton** |
|--------|----------------------------------|------------------------|-----------|------------|
| 1      | java -version                    | openjdk 21.x.x         | ⬜        | ⬜         |
| 2      | mvn -version                     | Maven 3.9.x            | ⬜        | ⬜         |
| 3      | node -v                          | v20.x.x                | ⬜        | ⬜         |
| 4      | ng version                       | Angular CLI 17.x       | ⬜        | ⬜         |
| 5      | git --version                    | git 2.x.x              | ⬜        | ⬜         |
| 6      | psql -U alugix_user -d alugix_db | Conexão OK             | ⬜        | ⬜         |
| 7      | code --version                   | 1.8x.x                 | ⬜        | ⬜         |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>⚠️ CHECKPOINT</strong></p>
<p>Ambos só prosseguem quando todos os itens estiverem marcados nas DUAS máquinas.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 5. Fase 1 — Estruturação dos Projetos

## 5.1 Criar Projeto Spring Boot — Erick

Erick cria o projeto no Spring Initializr (https://start.spring.io/):

| **Opção**   | **Valor**  |
|-------------|------------|
| Project     | Maven      |
| Language    | Java       |
| Spring Boot | 3.2.x      |
| Group       | com.alugix |
| Artifact    | alugix-api |
| Java        | 21         |

**Dependências:**

- Spring Web, Spring Data JPA, Spring Security, Validation

- PostgreSQL Driver, Lombok, Flyway Migration, DevTools

**Configurar application.yml:**

> server:
 port: 8080
 spring:
 datasource:
 url: jdbc:postgresql://localhost:5432/alugix_db
 username: alugix_user
 password: alugix@2026
 jpa:
 hibernate:
 ddl-auto: validate
 show-sql: true
 flyway:
 enabled: true

## 5.2 Criar Projeto Angular — Welton

Welton cria o projeto Angular:

> cd C:\projetos\alugix
 ng new alugix-web --routing --style=scss --strict
 cd alugix-web
 ng add @angular/material
 npm install chart.js ng2-charts ngx-mask

**Configurar proxy (proxy.conf.json):**

> { "/api": { "target": "http://localhost:8080", "secure": false } }

## 5.3 Banco de Dados — Erick

Erick cria a migration inicial com as 5 tabelas do PRD:

Arquivo: src/main/resources/db/migration/V1\_\_create_initial_tables.sql

Contém: CREATE TABLE de usuarios, imoveis, inquilinos, contratos e pagamentos.

## 5.4 Repositório Git — Ambos

Erick cria o repositório no GitHub e Welton clona:

> \# Erick:
 cd C:\projetos\alugix && git init && git add . && git commit -m "feat: estrutura inicial"
 git remote add origin https://github.com/\<user\>/alugix.git && git push -u origin main
 \# Welton:
 git clone https://github.com/\<user\>/alugix.git
 cd alugix && git checkout -b develop && git push -u origin develop

**Estrutura:**

> alugix/
 ├── alugix-api/ \# Erick (Spring Boot)
 ├── alugix-web/ \# Welton (Angular)
 ├── docs/ \# Ambos
 └── README.md

| **Branch**       | **Propósito**      | **Quem cria**    |
|------------------|--------------------|------------------|
| main             | Produção estável   | Erick (inicial)  |
| develop          | Integração         | Welton (inicial) |
| feature/back-\*  | Features back-end  | Erick            |
| feature/front-\* | Features front-end | Welton           |
| hotfix/\*        | Correções urgentes | Quem identificar |

# 6. Product Backlog com Responsabilidades

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

| **User Story**                                        | **Sprint** | **SP** | **Responsável** |
|-------------------------------------------------------|------------|--------|-----------------|
| Configurar Spring Boot + Flyway + entidades JPA       | 0          | 5      | Erick           |
| Configurar Angular + Material + layout base           | 0          | 5      | Welton          |
| Configurar CORS, Swagger, health check                | 0          | 2      | Erick           |
| Configurar proxy + teste de comunicação front→back    | 0          | 1      | Welton          |
| Implementar Spring Security + JWT                     | 1          | 8      | Erick           |
| Tela de login + AuthService + guards + interceptor    | 1          | 8      | Welton          |
| Testar fluxo completo de login end-to-end             | 1          | 2      | Ambos           |
| CRUD imóveis: Controller, Service, Repo, DTOs, Mapper | 2          | 8      | Erick           |
| Tela listagem + formulário + filtros imóveis          | 2          | 8      | Welton          |
| CRUD inquilinos + validação CPF (back)                | 3          | 8      | Erick           |
| Tela listagem + formulário + máscaras inquilinos      | 3          | 8      | Welton          |
| Criar/encerrar contrato + regras automáticas          | 4          | 13     | Erick           |
| Tela contratos + vínculo imóvel/inquilino             | 4          | 8      | Welton          |
| Pagamentos: registrar + scheduler atraso              | 5          | 8      | Erick           |
| Tela pagamentos por contrato                          | 5          | 8      | Welton          |
| Endpoints agregação dashboard                         | 6          | 5      | Erick           |
| Dashboard visual com gráficos e indicadores           | 6          | 8      | Welton          |
| CRUD usuários + @PreAuthorize Admin                   | 7          | 5      | Erick           |
| Painel Admin + filtro por usuário + RoleGuard         | 7          | 5      | Welton          |
| Testes unitários back (80% Services)                  | 8          | 5      | Erick           |
| Testes + responsividade + UX polish front             | 8          | 5      | Welton          |
| Swagger completo + revisão de erros                   | 8          | 3      | Erick           |
| Docker + docker-compose + CI/CD                       | 9          | 5      | Ambos           |
| Nginx + build produção Angular                        | 9          | 3      | Welton          |
| SSL + variáveis ambiente + testes carga               | 9          | 3      | Erick           |

# 7. Sprint 0 — Fundamentos e Configuração

**Objetivo: Ambos os projetos rodando e comunicando entre si.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Configurar application.yml com conexão PostgreSQL

- **\[Erick\]** Criar migration V1 com as 5 tabelas do modelo de dados

- **\[Erick\]** Criar migration V2 com seed do usuário Admin (BCrypt)

- **\[Erick\]** Criar entidades JPA básicas com anotações

- **\[Erick\]** Configurar CorsConfig permitindo localhost:4200

- **\[Erick\]** Criar HealthController: GET /api/v1/health

- **\[Erick\]** Configurar Swagger UI em /swagger-ui.html

### 🟧 Welton (Front-End)

- **\[Welton\]** Criar estrutura de módulos: core/, shared/, features/

- **\[Welton\]** Configurar proxy.conf.json para /api → localhost:8080

- **\[Welton\]** Criar layout base: sidebar fixa + toolbar + área de conteúdo

- **\[Welton\]** Configurar tema Angular Material customizado (cores Alugix)

- **\[Welton\]** Criar HttpService básico e testar chamada ao health check

### 🟣 Integração (Ambos)

- **\[Ambos\]** Testar front chamando GET /api/v1/health e exibindo resposta

- **\[Ambos\]** Merge das branches em develop

### ✅ Entrega

Front em :4200 mostrando "Sistema Online" vindo do back em :8080. Swagger acessível. Banco com tabelas criadas.

# 8. Sprint 1 — Autenticação e Autorização

**Objetivo: Login funcional com JWT diferenciando Admin e Usuário Comum.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Adicionar dependência jjwt ao pom.xml

- **\[Erick\]** Criar JwtTokenProvider (geração, validação, extração de claims)

- **\[Erick\]** Criar JwtAuthenticationFilter (filtro Spring Security)

- **\[Erick\]** Criar SecurityConfig: rotas públicas (/auth/\*\*) e protegidas

- **\[Erick\]** Criar AuthController: POST /auth/login retornando token

- **\[Erick\]** Criar CustomUserDetailsService

- **\[Erick\]** Implementar BCrypt para hash de senhas

### 🟧 Welton (Front-End)

- **\[Welton\]** Criar features/auth/login (tela de login)

- **\[Welton\]** Formulário reativo: e-mail + senha + botão entrar

- **\[Welton\]** Criar AuthService: login(), logout(), isAuthenticated(), getRole()

- **\[Welton\]** Armazenar token no localStorage

- **\[Welton\]** Criar TokenInterceptor: adicionar Bearer \<token\> automaticamente

- **\[Welton\]** Criar AuthGuard e RoleGuard

- **\[Welton\]** Redirecionar para /dashboard após login

### 🟣 Integração (Ambos)

- **\[Ambos\]** Testar login completo: Welton loga via tela, Erick valida no back

- **\[Ambos\]** Testar acesso negado a rotas protegidas sem token

# 9. Sprint 2 — CRUD de Imóveis

**Objetivo: Cadastro, edição, exclusão e listagem de imóveis funcionando end-to-end.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Criar ImovelController: GET, GET/{id}, POST, PUT/{id}, DELETE/{id}

- **\[Erick\]** Criar ImovelService com regras + filtro por usuario_id

- **\[Erick\]** Criar ImovelRepository com paginação e filtros (status, tipo, cidade)

- **\[Erick\]** Criar ImovelRequestDTO e ImovelResponseDTO

- **\[Erick\]** Criar ImovelMapper (MapStruct)

- **\[Erick\]** Bean Validation (@NotBlank, @NotNull, @Positive)

- **\[Erick\]** Soft delete: campo ativo=false

### 🟧 Welton (Front-End)

- **\[Welton\]** Criar features/imoveis/ com roteamento

- **\[Welton\]** Tela de listagem: MatTable + MatPaginator + MatSort

- **\[Welton\]** Filtros: tipo (select), status (chips), busca endereço (input)

- **\[Welton\]** Formulário cadastro/edição: Reactive Forms + validações

- **\[Welton\]** Máscaras: CEP (99999-999), valor monetário (R\$ 1.000,00)

- **\[Welton\]** Dialog de confirmação para exclusão

- **\[Welton\]** Snackbar de sucesso/erro

# 10. Sprint 3 — CRUD de Inquilinos

**Objetivo: Cadastro completo de inquilinos com validação de CPF.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Criar InquilinoController, Service, Repository, DTOs, Mapper

- **\[Erick\]** Validação de CPF: formato (algoritmo) + unicidade por usuário

- **\[Erick\]** Filtros: nome, CPF, status (ativo/inativo)

- **\[Erick\]** Soft delete ao desativar

### 🟧 Welton (Front-End)

- **\[Welton\]** Criar features/inquilinos/

- **\[Welton\]** Listagem com busca por nome e CPF

- **\[Welton\]** Formulário com máscaras: CPF e telefone

- **\[Welton\]** Validação de CPF no front-end (dígitos verificadores)

- **\[Welton\]** Badge de status: Ativo (verde) / Inativo (cinza)

# 11. Sprint 4 — Gestão de Contratos

**Objetivo: Criar contratos com regras automáticas de negócio.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Criar ContratoController, Service, Repository, DTOs, Mapper

- **\[Erick\]** Regra: só imóvel DISPONIVEL pode ser vinculado

- **\[Erick\]** Ao criar contrato: imóvel vira ALUGADO automaticamente

- **\[Erick\]** Ao encerrar: imóvel volta para DISPONIVEL

- **\[Erick\]** Gerar pagamentos PENDENTE (um por mês do período)

- **\[Erick\]** Endpoint PATCH /contratos/{id}/encerrar

### 🟧 Welton (Front-End)

- **\[Welton\]** Criar features/contratos/

- **\[Welton\]** Formulário: select imóvel (só disponíveis) + select inquilino (só ativos)

- **\[Welton\]** Campos: valor, data início/término, dia vencimento

- **\[Welton\]** Tela de detalhes com timeline de pagamentos

- **\[Welton\]** Botão "Encerrar Contrato" com dialog

- **\[Welton\]** Badges: Ativo (verde), Atrasado (vermelho), Encerrado (cinza)

# 12. Sprint 5 — Pagamentos

**Objetivo: Registro e controle de pagamentos mensais.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Criar PagamentoController e PagamentoService

- **\[Erick\]** GET /contratos/{id}/pagamentos — listar todos

- **\[Erick\]** PATCH /pagamentos/{id}/pagar — registrar pagamento

- **\[Erick\]** @Scheduled job diário: marcar vencidos como ATRASADO

- **\[Erick\]** Atualizar status do contrato conforme pagamentos

### 🟧 Welton (Front-End)

- **\[Welton\]** Tela pagamentos dentro do detalhe do contrato

- **\[Welton\]** Dialog "Registrar Pagamento": valor, data, forma

- **\[Welton\]** Cores: Pago=verde, Pendente=amarelo, Atrasado=vermelho

- **\[Welton\]** Filtro por status de pagamento

# 13. Sprint 6 — Dashboard e Relatórios

**Objetivo: Dashboard visual com indicadores da carteira.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Criar DashboardController com endpoints de agregação

- **\[Erick\]** GET /dashboard/resumo — total imóveis por status

- **\[Erick\]** GET /dashboard/receita — prevista vs recebida (mensal)

- **\[Erick\]** GET /dashboard/inadimplencia — contratos atrasados

- **\[Erick\]** GET /dashboard/contratos-vencer — próximos do término

### 🟧 Welton (Front-End)

- **\[Welton\]** Criar features/dashboard/ como página inicial

- **\[Welton\]** Cards: Total Imóveis, Alugados, Disponíveis, Manutenção

- **\[Welton\]** Gráfico de barras: receita prevista vs recebida (últimos 6 meses)

- **\[Welton\]** Lista: contratos com pagamento atrasado

- **\[Welton\]** Lista: contratos próximos do vencimento (30 dias)

# 14. Sprint 7 — Admin e Permissões

**Objetivo: Painel administrativo com gestão de usuários e visão global.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Criar UsuarioController (CRUD — apenas Admin)

- **\[Erick\]** @PreAuthorize("hasRole('ADMIN')") nos endpoints administrativos

- **\[Erick\]** Endpoints de relatórios globais (todos usuários)

- **\[Erick\]** Filtro opcional por usuario_id nos endpoints existentes

### 🟧 Welton (Front-End)

- **\[Welton\]** Criar features/admin/ (protegido por RoleGuard)

- **\[Welton\]** Tela gestão de usuários: listagem, criação, edição, desativação

- **\[Welton\]** Dashboard Admin com dados globais

- **\[Welton\]** Filtro por usuário no painel Admin

- **\[Welton\]** Menu lateral mostra Admin apenas para perfil ADMIN

# 15. Sprint 8 — Testes e Polimento

**Objetivo: Qualidade, testes e ajustes finais de UX.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick (Back-End)

- **\[Erick\]** Testes unitários: JUnit 5 + Mockito (todos os Services)

- **\[Erick\]** Testes de integração: @SpringBootTest (Controllers)

- **\[Erick\]** Cobertura mínima 80% nos Services

- **\[Erick\]** Completar documentação Swagger: descrições, exemplos, códigos de erro

- **\[Erick\]** Revisar GlobalExceptionHandler e logs de auditoria

### 🟧 Welton (Front-End)

- **\[Welton\]** Testes unitários: Jasmine/Karma (componentes críticos)

- **\[Welton\]** Responsividade: testar tablet e mobile

- **\[Welton\]** UX: loading states, empty states, mensagens amigáveis

- **\[Welton\]** Acessibilidade: labels, aria, contraste

- **\[Welton\]** Lazy loading dos módulos

### 🟣 Integração (Ambos)

- **\[Ambos\]** Code review cruzado final

- **\[Ambos\]** Testes end-to-end de todos os fluxos

# 16. Sprint 9 — Deploy e Entrega

**Objetivo: Containerizar e realizar deploy em produção.**

| **🟦 Erick — Back-End** | **🟧 Welton — Front-End** | **🟣 Ambos — Compartilhado** |
|-------------------------|---------------------------|------------------------------|

### 🟦 Erick

- **\[Erick\]** Criar Dockerfile multi-stage para alugix-api

- **\[Erick\]** Configurar variáveis de ambiente para produção

- **\[Erick\]** Configurar HTTPS com SSL (Let's Encrypt)

- **\[Erick\]** Testes de carga básicos

### 🟧 Welton

- **\[Welton\]** Criar Dockerfile para alugix-web (build Angular + Nginx)

- **\[Welton\]** Configurar Nginx como proxy reverso

- **\[Welton\]** Build de produção otimizado (ng build --configuration production)

### 🟣 Ambos

- **\[Ambos\]** Criar docker-compose.yml orquestrando API + Web + PostgreSQL

- **\[Ambos\]** Configurar GitHub Actions (build + testes a cada push)

- **\[Ambos\]** Testes finais em ambiente de produção

- **\[Ambos\]** Monitoramento com logs estruturados

### ✅ Entrega Final

Sistema em produção, acessível via HTTPS, com CI/CD. Projeto concluído!

# 17. Definição de Pronto (Definition of Done)

Uma tarefa só é "pronta" quando TODOS os critérios abaixo forem atendidos:

| **\#** | **Critério**                                       | **Responsável**  |
|--------|----------------------------------------------------|------------------|
| 1      | Código compilando sem erros ou warnings            | Quem desenvolveu |
| 2      | Endpoint documentado no Swagger                    | Erick            |
| 3      | Validações de entrada implementadas (back + front) | Quem desenvolveu |
| 4      | Testes unitários escritos e passando               | Quem desenvolveu |
| 5      | Filtro por usuario_id aplicado                     | Erick            |
| 6      | Interface responsiva testada                       | Welton           |
| 7      | Loading states e tratamento de erros               | Welton           |
| 8      | Code review cruzado realizado                      | O outro dev      |
| 9      | Commit com Conventional Commits                    | Quem desenvolveu |
| 10     | Branch mergeada em develop sem conflitos           | Quem desenvolveu |
| 11     | Integração front+back testada                      | Ambos            |

**Padrão de commits:**

- feat: nova funcionalidade

- fix: correção de bug

- docs: documentação

- test: testes

- refactor: refatoração

- chore: manutenção

# 18. Cronograma Resumido

| **Sprint** | **Período** | **Erick (Back)**                    | **Welton (Front)**              |
|------------|-------------|-------------------------------------|---------------------------------|
| Fase 0     | Semana 0    | Instalar ambiente                   | Instalar ambiente               |
| Fase 1     | Semana 0    | Criar Spring Boot + banco           | Criar Angular + layout          |
| Sprint 0   | Sem 1-2     | Entidades + Flyway + CORS + Swagger | Módulos + proxy + layout + tema |
| Sprint 1   | Sem 3-4     | Spring Security + JWT + Auth        | Login + guards + interceptor    |
| Sprint 2   | Sem 5-6     | CRUD Imóveis (API)                  | Telas Imóveis (UI)              |
| Sprint 3   | Sem 7-8     | CRUD Inquilinos + CPF               | Telas Inquilinos + máscaras     |
| Sprint 4   | Sem 9-10    | Contratos + regras negócio          | Telas Contratos + vínculos      |
| Sprint 5   | Sem 11-12   | Pagamentos + scheduler              | Tela Pagamentos + cores         |
| Sprint 6   | Sem 13-14   | Endpoints dashboard                 | Dashboard + gráficos            |
| Sprint 7   | Sem 15-16   | CRUD Usuários + Admin               | Painel Admin + RoleGuard        |
| Sprint 8   | Sem 17-18   | Testes + Swagger completo           | Testes + UX + responsivo        |
| Sprint 9   | Sem 19-20   | Docker API + SSL + carga            | Docker Web + Nginx + build      |

*Fim do Documento — Bom trabalho, Erick e Welton! 🚀*
