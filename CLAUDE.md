# Alugix — Sistema de Gerenciamento de Aluguéis

## Visão Geral

Aplicação web para investidores imobiliários gerenciarem imóveis, inquilinos e contratos de aluguel.

- **Back-End (Erick):** Java 21 + Spring Boot 3.2 + Spring Security + JPA + Flyway
- **Front-End (Welton):** Angular 17+ + Angular Material + TypeScript
- **Banco de Dados:** PostgreSQL 16
- **Containerização:** Docker + Docker Compose + Nginx
- **Repositório:** monorepo com `alugix-api/` e `alugix-web/`

## Equipe e Responsabilidades

| Desenvolvedor | Área       | Prefixo de Branch        |
|---------------|------------|--------------------------|
| Erick         | Back-End   | `feature/back-*`, `fix/back-*`  |
| Welton        | Front-End  | `feature/front-*`, `fix/front-*` |

Claude Code auxilia **Erick** no back-end (Java / Spring Boot).

---

## Estrutura do Repositório

```
alugix/
├── alugix-api/          # Spring Boot (Erick)
├── alugix-web/          # Angular (Welton)
├── Documentação/        # PRD, Contrato da API, Banco, Padrões, Plano Ágil
└── CLAUDE.md
```

### Estrutura de Pacotes — Back-End

```
com.alugix/
├── config/        # SecurityConfig, CorsConfig, SwaggerConfig
├── controller/    # Controllers REST (zero lógica de negócio)
├── dto/
│   ├── request/   # ImovelRequestDTO, LoginRequestDTO, etc.
│   └── response/  # ImovelResponseDTO, ErrorResponse, etc.
├── entity/        # Entidades JPA (nunca expor na API)
├── enums/         # StatusImovel, TipoImovel, Perfil, StatusContrato, StatusPagamento
├── exception/     # ResourceNotFoundException, BusinessException
├── mapper/        # MapStruct mappers (DTO <-> Entity)
├── repository/    # Spring Data JPA repositories
├── security/      # JwtTokenProvider, JwtFilter, UserDetailsImpl
├── service/       # Lógica de negócio (@Transactional)
└── util/          # CpfValidator, DateUtils
```

---

## Banco de Dados

**PostgreSQL 16** com migrations via Flyway em `src/main/resources/db/migration/`.

### Tabelas

| Tabela      | Descrição                          |
|-------------|------------------------------------|
| usuarios    | Usuários do sistema (ADMIN/USUARIO)|
| imoveis     | Imóveis cadastrados (por usuário)  |
| inquilinos  | Inquilinos (por usuário)           |
| contratos   | Contratos vinculando imóvel+inquilino |
| pagamentos  | Pagamentos mensais por contrato    |

### Relacionamentos

- `usuarios` 1:N `imoveis`
- `usuarios` 1:N `inquilinos`
- `usuarios` 1:N `contratos`
- `imoveis` 1:N `contratos` (apenas 1 ativo por vez)
- `inquilinos` 1:N `contratos`
- `contratos` 1:N `pagamentos`

### Convenções do Banco

- Tabelas: `snake_case` plural (ex: `imoveis`, `pagamentos`)
- Colunas: `snake_case` (ex: `valor_aluguel`, `data_inicio`)
- PKs: sempre `id BIGSERIAL PRIMARY KEY`
- FKs: `{tabela_singular}_id` (ex: `usuario_id`, `imovel_id`)
- Timestamps: `created_at` e `updated_at` em todas as tabelas
- Soft delete: campo `ativo BOOLEAN` (nunca DELETE físico)
- Enums: `VARCHAR` com `CHECK` constraint (não usar tipo ENUM nativo do PostgreSQL)
- Migrations: `V{n}__{descricao}.sql` (ex: `V1__create_initial_tables.sql`)
- Índices: `idx_{tabela}_{coluna}` (ex: `idx_imoveis_status`)

### Migrations Planejadas

- `V1__create_initial_tables.sql` — 5 tabelas principais + índices
- `V2__seed_admin.sql` — usuário admin padrão (admin@alugix.com / Admin@2026)

### Conexão Local

```yaml
url: jdbc:postgresql://localhost:5432/alugix_db
username: alugix_user
password: alugix@2026
```

### Enums de Domínio

| Contexto   | Valores                          |
|------------|----------------------------------|
| Perfil     | ADMIN, USUARIO                   |
| StatusImovel | DISPONIVEL, ALUGADO, MANUTENCAO |
| TipoImovel | CASA, APARTAMENTO, SALA_COMERCIAL |
| StatusContrato | ATIVO, ENCERRADO, ATRASADO   |
| StatusPagamento | PAGO, PENDENTE, ATRASADO   |

---

## API REST — Contrato

**Base URL:** `http://localhost:8080/api/v1`
**Autenticação:** Bearer Token JWT (24h)
**Paginação:** `?page=0&size=10&sort=campo,asc`
**Swagger:** `http://localhost:8080/swagger-ui.html`

### Endpoints

| Módulo      | Endpoints principais                                        |
|-------------|-------------------------------------------------------------|
| Auth        | POST /auth/login, POST /auth/refresh, POST /auth/forgot-password |
| Usuários    | GET/POST/PUT/DELETE /usuarios (só Admin)                    |
| Imóveis     | GET/POST/PUT/DELETE /imoveis, GET /imoveis/{id}             |
| Inquilinos  | GET/POST/PUT/DELETE /inquilinos, GET /inquilinos/{id}       |
| Contratos   | GET/POST/PUT /contratos, PATCH /contratos/{id}/encerrar     |
| Pagamentos  | GET /contratos/{id}/pagamentos, PATCH /pagamentos/{id}/pagar |
| Dashboard   | GET /dashboard/resumo, /receita, /inadimplencia, /contratos-vencer |

### Padrão de Resposta de Erro

```json
{
  "timestamp": "2026-03-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "CPF já cadastrado",
  "path": "/api/v1/inquilinos",
  "errors": [{ "field": "cpf", "message": "CPF já existe" }]
}
```

### Códigos HTTP Obrigatórios

- `200 OK` — sucesso em GET/PUT
- `201 Created` — sucesso em POST
- `204 No Content` — sucesso em DELETE
- `400 Bad Request` — validação falhou
- `401 Unauthorized` — token inválido/ausente
- `403 Forbidden` — sem permissão
- `404 Not Found` — recurso inexistente
- `409 Conflict` — ex: imóvel já alugado
- `422 Unprocessable` — regra de negócio violada

---

## Padrões de Código — Back-End (Java / Spring Boot)

### Arquitetura em Camadas (obrigatório)

```
Request HTTP → Controller → Service → Repository → Database
```

| Camada     | Responsabilidade                              | Proibido                                      |
|------------|-----------------------------------------------|-----------------------------------------------|
| Controller | Receber HTTP, @Valid, delegar ao Service       | Lógica de negócio, acesso a Repository        |
| Service    | Lógica de negócio, @Transactional             | Conhecer HttpRequest, retornar ResponseEntity |
| Repository | Queries, Spring Data JPA                      | Lógica de negócio                             |
| Entity     | Mapeamento JPA                                | Ser exposta na API (sempre usar DTO)          |
| DTO        | Transferência de dados                        | Anotações JPA                                 |

### Padrão de Exclusão e Ativação (obrigatório a partir da Sprint 2)

Todo recurso com campo `ativo` deve seguir este padrão:

- **DELETE físico** — `DELETE /{id}` remove o registro do banco permanentemente
- **Toggle ativo** — `PATCH /{id}/ativo` alterna entre ativo/inativo sem excluir
- **Listagem retorna todos** — `GET /recurso` retorna ativos e inativos por padrão
- **Filtro opcional** — `GET /recurso?ativo=true` ou `?ativo=false` para filtrar
- **Campo `ativo` no ResponseDTO** — sempre incluir para o front poder exibir o estado
- **buscarPorId** continua filtrando por `ativoTrue` (recurso inativo não é acessível individualmente sem reativar)

```
PATCH /imoveis/{id}/ativo    → alterna ativo/inativo
DELETE /imoveis/{id}         → exclui permanentemente
GET /imoveis                 → retorna todos
GET /imoveis?ativo=true      → só ativos
GET /imoveis?ativo=false     → só inativos
```

### Regras Obrigatórias

- `@RequiredArgsConstructor` em Controllers e Services (injeção via construtor)
- `@Valid` em todos os DTOs de entrada nos Controllers
- Nunca usar `@Data` em entidades JPA (problemas com `hashCode`/`equals`)
- Usar `@Getter @Setter` em entidades
- `@Column(name = "valor_aluguel")` explícito para garantir snake_case no banco
- `@CreatedDate` e `@LastModifiedDate` com JPA Auditing habilitado
- Máximo 30 linhas por método de Service — extrair métodos privados se necessário
- `Logger` sempre (nunca `System.out.println`)
- Paginação (`Pageable`) em todas as listagens
- Swagger documentado: `@Tag`, `@Operation`, `@ApiResponse` em todos os endpoints

### Design Patterns

- **DTO Pattern:** `ImovelRequestDTO` (o front envia) e `ImovelResponseDTO` (o front recebe)
- **Mapper Pattern:** MapStruct para conversão Entity <-> DTO
- **Repository Pattern:** Spring Data JPA com métodos derivados e `@Query`
- **Builder Pattern:** `@Builder` do Lombok nos DTOs
- **Global Exception Handler:** `@RestControllerAdvice` tratando todas as exceções

### Exceções Customizadas

- `ResourceNotFoundException` → HTTP 404
- `BusinessException` → HTTP 422
- `MethodArgumentNotValidException` → HTTP 400 com lista de erros por campo

### Isolamento de Dados (multi-tenancy lógico)

- Todo endpoint deve filtrar por `usuario_id` extraído do `SecurityContext`
- Usuário Comum só vê seus próprios dados
- Admin tem visibilidade global
- Operações de escrita sempre vinculadas ao usuário autenticado

### Regras de Negócio Críticas

- Só imóvel com status `DISPONIVEL` pode ser vinculado a contrato
- Ao criar contrato: imóvel vira `ALUGADO` automaticamente + gera pagamentos `PENDENTE`
- Ao encerrar contrato: imóvel volta para `DISPONIVEL`
- Imóvel já `ALUGADO` → retornar `409 Conflict`
- CPF único por usuário (não globalmente)
- `@Scheduled` job diário: marcar pagamentos vencidos como `ATRASADO`

### Nomenclatura Java

| Elemento   | Convenção           | Exemplo                        |
|------------|---------------------|--------------------------------|
| Classes    | PascalCase          | `ImovelService`, `ContratoController` |
| Métodos    | camelCase           | `findByUsuarioId()`, `criarContrato()` |
| Variáveis  | camelCase           | `valorAluguel`, `dataInicio`   |
| Constantes | UPPER_SNAKE_CASE    | `MAX_PAGE_SIZE`                |
| Packages   | lowercase           | `com.alugix.controller`        |
| Entidades  | Singular PascalCase | `Imovel`, `Contrato`, `Pagamento` |
| DTOs       | NomeAcaoDTO         | `ImovelRequestDTO`, `ImovelResponseDTO` |
| Enums      | PascalCase + valores UPPER_SNAKE | `StatusImovel { DISPONIVEL, ALUGADO }` |
| Endpoints  | kebab-case, plural  | `GET /api/v1/imoveis`          |

---

## Sprints e Status

| Sprint | Objetivo                     | Status    |
|--------|------------------------------|-----------|
| 0      | Fundamentos + configuração   | Pendente  |
| 1      | Autenticação JWT             | Pendente  |
| 2      | CRUD Imóveis                 | Pendente  |
| 3      | CRUD Inquilinos              | Pendente  |
| 4      | Contratos + regras           | Pendente  |
| 5      | Pagamentos + scheduler       | Pendente  |
| 6      | Dashboard + relatórios       | Pendente  |
| 7      | Admin + permissões           | Pendente  |
| 8      | Testes + polimento           | Pendente  |
| 9      | Docker + Deploy              | Pendente  |

---

## Padrões de Git

### Conventional Commits (em português)

```
<tipo>(<escopo>): <descrição curta em português>
```

| Tipo       | Quando usar         |
|------------|---------------------|
| `feat`     | Nova funcionalidade |
| `fix`      | Correção de bug     |
| `docs`     | Documentação        |
| `refactor` | Refatoração         |
| `test`     | Testes              |
| `chore`    | Manutenção          |

**Exemplos:**
```
feat(imoveis): criar endpoint POST /imoveis com validações
fix(auth): corrigir expiração do token JWT
test(contratos): testes unitários ContratoService
```

### Fluxo de Branches

1. Criar branch a partir de `develop`
2. Erick usa prefixo `feature/back-*` ou `fix/back-*`
3. Abrir Pull Request para `develop` após concluir
4. Welton revisa o back-end (e vice-versa)
5. **Nunca** commitar direto em `main` ou `develop`

---

## Checklist de Qualidade — Back-End (Erick)

Antes de abrir um PR, verificar:

- [ ] Endpoint segue o Contrato da API (URL, método HTTP, DTO)
- [ ] `@Valid` nos DTOs de entrada
- [ ] Filtro por `usuario_id` aplicado
- [ ] Exceções tratadas (`ResourceNotFoundException`, `BusinessException`)
- [ ] Status HTTP correto (200, 201, 204, 400, 404, 422)
- [ ] Paginação implementada nas listagens
- [ ] Swagger documentado (`@Tag`, `@Operation`)
- [ ] Sem `System.out.println` (usar `Logger`)
- [ ] Conventional Commit na mensagem

---

## Documentação de Referência

Todos os documentos estão em `Documentação/`:

| Arquivo                              | Conteúdo                                      |
|--------------------------------------|-----------------------------------------------|
| `Alugix_PRD_v1.0.md`                 | Requisitos funcionais e não funcionais        |
| `Alugix_Banco_Dados_v1.0.md`         | Modelo ER, schema SQL completo, seeds         |
| `Alugix_Contrato_API_v1.0.md`        | Endpoints, DTOs, códigos de erro (fonte de verdade Erick <-> Welton) |
| `Alugix_Padroes_Codigo_Design_v1.0.md` | Design patterns, nomenclatura, Git, UI      |
| `Alugix_Plano_Agil_v1.1.md`          | Sprints, backlog, setup do ambiente           |
