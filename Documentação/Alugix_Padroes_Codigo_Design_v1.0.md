**ALUGIX**

Guia de Padrões de Código e Design

Design Patterns • Nomenclatura • Arquitetura • Git • UI Design

*Regras obrigatórias para Erick (Back) e Welton (Front)*

**Versão 1.1 — Março de 2026**

**Sumário**

# 1. Objetivo

# 2. Design Patterns — Back-End (Erick)

  - 2.1 Layered Architecture
  - 2.2 DTO Pattern
  - 2.3 Mapper Pattern
  - 2.4 Repository Pattern
  - 2.5 Global Exception Handler
  - 2.6 Builder (Lombok)

# 3. Design Patterns — Front-End (Welton)

  - 3.1 Smart/Dumb Components
  - 3.2 Service Pattern
  - 3.3 Reactive Forms
  - 3.4 Interceptor Pattern
  - 3.5 Guard Pattern
  - 3.6 Lazy Loading

# 4. Nomenclatura

  - 4.1 Java (Erick)
  - 4.2 Angular (Welton)
  - 4.3 Banco de Dados

# 5. Estrutura de Pastas

# 6. Padrões de Código Java (Erick)

# 7. Padrões de Código Angular (Welton)

# 8. Padrões de Git

# 9. Code Review Cruzado

# 10. Padrão Visual / UI Design (Welton)

  - 10.0 Tema (claro único — dark mode removido)
  - 10.1 Paleta de Cores (Design Tokens)
  - 10.4 Layout Principal
  - 10.5 Componentes de UI Padrão
  - 10.6 Padrão de Badges de Status
  - 10.7 Responsividade
  - 10.8 Sistema de Tabelas Global
  - 10.9 Tipografia

# 11. Checklist de Qualidade

# 1. Objetivo deste Guia

Este documento define as regras obrigatórias de codificação, nomenclatura, arquitetura, design patterns e processos que Erick e Welton devem seguir durante todo o desenvolvimento do Alugix.

O objetivo é garantir consistência, legibilidade e mantenabilidade do código, facilitando o code review cruzado e futuras manutenções.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>🚨 REGRA DE OURO</strong></p>
<p>Se não está neste documento, discutam e adicionem ANTES de implementar. Padrões não documentados não existem.</p></td>
</tr>
</tbody>
</table>

# 2. Design Patterns — Back-End (Erick)

A arquitetura do back-end segue o padrão de camadas com os seguintes design patterns obrigatórios:

## 2.1 Layered Architecture (Arquitetura em Camadas)

O fluxo de uma requisição segue sempre esta direção:

> Request HTTP → Controller → Service → Repository → Database

|            |                                                                                   |                                                        |
|------------|-----------------------------------------------------------------------------------|--------------------------------------------------------|
| **Camada** | **Responsabilidade**                                                              | **NUNCA deve fazer**                                   |
| Controller | Receber HTTP, validar input (@Valid), delegar ao Service, retornar ResponseEntity | Conter lógica de negócio ou acessar Repository         |
| Service    | Lógica de negócio, transações, orquestração                                       | Conhecer HttpServletRequest ou retornar ResponseEntity |
| Repository | Acesso a dados, queries customizadas                                              | Conter lógica de negócio                               |
| Entity     | Mapeamento JPA das tabelas do banco                                               | Ser exposta na API (sempre usar DTO)                   |
| DTO        | Transferência de dados entre camadas                                              | Conter anotações JPA (@Entity, @Column)                |

## 2.2 DTO Pattern (Data Transfer Object)

Nunca expor entidades JPA diretamente na API. Sempre usar DTOs separados para Request e Response:

> ✅ return imovelMapper.toResponse(imovel); // DTO
 ❌ return imovelRepository.findById(id).get(); // Entity exposta!

**Separação obrigatória:**

- ImovelRequestDTO — campos que o front envia (sem id, sem timestamps)

- ImovelResponseDTO — campos que o front recebe (com id, status, timestamps)

## 2.3 Mapper Pattern (MapStruct)

Usar MapStruct para conversão automática entre Entity e DTO:

> @Mapper(componentModel = "spring")
 public interface ImovelMapper {
 ImovelResponseDTO toResponse(Imovel entity);
 Imovel toEntity(ImovelRequestDTO dto);
 void updateEntity(@MappingTarget Imovel entity, ImovelRequestDTO dto);
 }

## 2.4 Repository Pattern (Spring Data JPA)

Usar interfaces Spring Data com métodos derivados e @Query para consultas complexas:

> public interface ImovelRepository extends JpaRepository\<Imovel, Long\> {
 Page\<Imovel\> findByUsuarioIdAndAtivoTrue(Long userId, Pageable p);
 @Query("SELECT i FROM Imovel i WHERE i.usuarioId = :uid AND i.status = :st")
 List\<Imovel\> buscarPorStatus(@Param("uid") Long uid, @Param("st") String st);
 }

## 2.5 Global Exception Handler (@ControllerAdvice)

Todas as exceções são tratadas centralmente. Criar exceções customizadas:

> @RestControllerAdvice
 public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class)
 public ResponseEntity\<ErrorResponse\> handleNotFound(ResourceNotFoundException ex) {
 return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
 }
 @ExceptionHandler(BusinessException.class)
 public ResponseEntity\<ErrorResponse\> handleBusiness(BusinessException ex) {
 return ResponseEntity.status(422).body(new ErrorResponse(422, ex.getMessage()));
 }
 @ExceptionHandler(MethodArgumentNotValidException.class)
 public ResponseEntity\<ErrorResponse\> handleValidation(MethodArgumentNotValidException ex) {
 // Extrair erros de campo e retornar 400
 }
 }

## 2.6 Builder Pattern (Lombok)

Usar @Builder para construção de DTOs e respostas:

> @Data @Builder @NoArgsConstructor @AllArgsConstructor
 public class ImovelResponseDTO {
 private Long id;
 private String endereco;
 private BigDecimal valorAluguel;
 private String status;
 }

# 3. Design Patterns — Front-End (Welton)

## 3.1 Smart/Dumb Components (Container/Presentational)

Separar componentes em dois tipos para facilitar testes e reutilização:

|                       |                                                    |                                          |
|-----------------------|----------------------------------------------------|------------------------------------------|
| **Tipo**              | **Responsabilidade**                               | **Exemplo**                              |
| Smart (Container)     | Busca dados via Service, gerencia estado da página | ImovelListPageComponent                  |
| Dumb (Presentational) | Recebe @Input, emite @Output, zero lógica de dados | ImovelCardComponent, ImovelFormComponent |

> ✅ // Smart: busca dados
 ✅ imoveis\$ = this.imovelService.listar(this.params);
 ✅ // Dumb: só recebe e exibe
 ✅ @Input() imovel: Imovel;
 ✅ @Output() editar = new EventEmitter\<number\>();

## 3.2 Service Pattern

Cada recurso da API tem seu próprio Service:

> @Injectable({ providedIn: 'root' })
 export class ImovelService {
 private readonly API_URL = '/api/v1/imoveis';
 constructor(private http: HttpClient) {}
 listar(params: HttpParams): Observable\<Page\<Imovel\>\> {
 return this.http.get\<Page\<Imovel\>\>(this.API_URL, { params });
 }
 criar(dto: ImovelRequest): Observable\<Imovel\> {
 return this.http.post\<Imovel\>(this.API_URL, dto);
 }
 }

## 3.3 Reactive Forms (obrigatório)

Nunca usar Template-driven forms. Sempre Reactive Forms:

> ✅ this.form = this.fb.group({
 ✅ endereco: \['', \[Validators.required, Validators.maxLength(300)\]\],
 ✅ valorAluguel: \[null, \[Validators.required, Validators.min(1)\]\],
 ✅ });
 ❌ \<input \[(ngModel)\]="imovel.endereco"\> // PROIBIDO!

## 3.4 Interceptor Pattern

TokenInterceptor adiciona JWT automaticamente em todas as requisições HTTP:

> @Injectable()
 export class TokenInterceptor implements HttpInterceptor {
 intercept(req: HttpRequest\<any\>, next: HttpHandler) {
 const token = this.authService.getToken();
 if (token) {
 req = req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } });
 }
 return next.handle(req);
 }
 }

## 3.5 Guard Pattern

Proteger rotas com Guards:

- AuthGuard — verifica se o usuário está logado (tem token válido)

- RoleGuard — verifica se o usuário tem perfil ADMIN

## 3.6 Lazy Loading (obrigatório)

Cada feature module é carregado sob demanda para performance:

> const routes: Routes = \[
 { path: 'imoveis', loadChildren: () =\>
 import('./features/imoveis/imoveis.module').then(m =\> m.ImoveisModule) },
 { path: 'admin', loadChildren: () =\>
 import('./features/admin/admin.module').then(m =\> m.AdminModule),
 canActivate: \[AuthGuard, RoleGuard\] },
 \];

# 4. Convenções de Nomenclatura

## 4.1 Java / Spring Boot (Erick)

|              |                                  |                                               |
|--------------|----------------------------------|-----------------------------------------------|
| **Elemento** | **Convenção**                    | **Exemplo**                                   |
| Classes      | PascalCase                       | ImovelService, ContratoController             |
| Métodos      | camelCase                        | findByUsuarioId(), criarContrato()            |
| Variáveis    | camelCase                        | valorAluguel, dataInicio                      |
| Constantes   | UPPER_SNAKE_CASE                 | MAX_PAGE_SIZE, TOKEN_EXPIRATION_MS            |
| Packages     | lowercase                        | com.alugix.controller, com.alugix.dto.request |
| Entidades    | Singular PascalCase              | Imovel, Contrato, Pagamento                   |
| DTOs         | NomeAçãoDTO                      | ImovelRequestDTO, ImovelResponseDTO           |
| Enums        | PascalCase + UPPER_SNAKE valores | StatusImovel { DISPONIVEL, ALUGADO }          |
| Endpoints    | kebab-case, plural               | GET /api/v1/imoveis                           |

## 4.2 Angular / TypeScript (Welton)

|                     |                            |                                      |
|---------------------|----------------------------|--------------------------------------|
| **Elemento**        | **Convenção**              | **Exemplo**                          |
| Arquivos componente | kebab-case                 | imovel-list.component.ts             |
| Classes TS          | PascalCase                 | ImovelListComponent, AuthService     |
| Interfaces/Models   | PascalCase (sem prefixo I) | Imovel, Contrato, Page\<T\>          |
| Métodos             | camelCase                  | listarImoveis(), onSubmit()          |
| Observables         | sufixo \$                  | imoveis\$, loading\$, user\$         |
| Seletores           | prefixo app-               | \<app-imovel-card\>, \<app-sidebar\> |
| Modules             | kebab-case                 | imoveis.module.ts                    |
| Services            | kebab-case                 | imovel.service.ts                    |
| Rotas               | kebab-case                 | '/imoveis', '/inquilinos'            |

## 4.3 Banco de Dados

|              |                         |                                 |
|--------------|-------------------------|---------------------------------|
| **Elemento** | **Convenção**           | **Exemplo**                     |
| Tabelas      | snake_case, plural      | imoveis, pagamentos             |
| Colunas      | snake_case              | valor_aluguel, data_inicio      |
| PKs          | sempre 'id'             | id BIGSERIAL PRIMARY KEY        |
| FKs          | tabela_singular_id      | usuario_id, imovel_id           |
| Índices      | idx_tabela_coluna       | idx_imoveis_status              |
| Migrations   | V{n}\_\_{descricao}.sql | V1\_\_create_initial_tables.sql |

# 5. Estrutura de Pastas

## 5.1 Back-End (Erick)

> com.alugix/
 ├── config/ // SecurityConfig, CorsConfig, SwaggerConfig
 ├── controller/ // AuthController, ImovelController, etc.
 ├── dto/
 │ ├── request/ // ImovelRequestDTO, LoginRequestDTO
 │ └── response/ // ImovelResponseDTO, ErrorResponse
 ├── entity/ // Imovel, Contrato, Pagamento, Usuario
 ├── enums/ // StatusImovel, TipoImovel, Perfil
 ├── exception/ // ResourceNotFoundException, BusinessException
 ├── mapper/ // ImovelMapper, ContratoMapper (MapStruct)
 ├── repository/ // ImovelRepository, ContratoRepository
 ├── security/ // JwtTokenProvider, JwtFilter, UserDetailsImpl
 ├── service/ // ImovelService, ContratoService, AuthService
 └── util/ // CpfValidator, DateUtils

## 5.2 Front-End (Welton)

> src/app/
 ├── core/ // Singleton (carregado 1x)
 │ ├── guards/ // auth.guard.ts, role.guard.ts
 │ ├── interceptors/ // token.interceptor.ts, error.interceptor.ts
 │ └── services/ // auth.service.ts (APENAS auth aqui)
 ├── shared/ // Componentes reutilizáveis
 │ ├── components/
 │ │ ├── confirm-dialog/ // ConfirmDialogComponent — diálogos de confirmação
 │ │ └── pagination/ // PaginationComponent — paginação customizada (desktop + mobile)
 │ ├── directives/ // date-mask.directive.ts
 │ ├── pipes/ // cpf.pipe.ts, currency-br.pipe.ts
 │ └── validators/ // cpf.validator.ts
 ├── features/ // Lazy-loaded modules
 │ ├── auth/ // login/
 │ ├── dashboard/ // dashboard-page/
 │ ├── imoveis/ // imovel-list/, imovel-form/, imovel.service.ts
 │ ├── inquilinos/ // inquilino-list/, inquilino-form/
 │ ├── contratos/ // contrato-list/, contrato-detail/
 │ └── admin/ // user-list/, admin-dashboard/
 ├── models/ // imovel.model.ts, contrato.model.ts, page.model.ts
 └── environments/ // environment.ts, environment.prod.ts

**Regras:**

- Services de recurso (ImovelService) ficam DENTRO do feature module

- Apenas AuthService fica em core/

- Um componente por pasta (component.ts + .html + .scss + .spec.ts)

# 6. Padrões de Código Java (Erick)

### 6.1 Controllers

Exemplo de Controller padrão:

> @RestController
 @RequestMapping("/api/v1/imoveis")
 @RequiredArgsConstructor
 @Tag(name = "Imóveis", description = "CRUD de imóveis")
 public class ImovelController {
 private final ImovelService service;
 @GetMapping
 public ResponseEntity\<Page\<ImovelResponseDTO\>\> listar(
 @RequestParam(defaultValue = "0") int page,
 @RequestParam(defaultValue = "10") int size) {
 return ResponseEntity.ok(service.listar(page, size));
 }
 @PostMapping
 public ResponseEntity\<ImovelResponseDTO\> criar(@Valid @RequestBody ImovelRequestDTO dto) {
 return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
 }
 }

**Regras obrigatórias:**

- Sempre @RequiredArgsConstructor (injeção via construtor)

- Sempre @Valid nos DTOs de entrada

- Retornar ResponseEntity com status correto (200, 201, 204)

- ZERO lógica de negócio no controller

- Sempre documentar com @Tag e @Operation (Swagger)

### 6.2 Services

- Usar @Service + @Transactional

- Extrair usuario_id do SecurityContext automaticamente

- Lançar ResourceNotFoundException quando recurso não existe

- Lançar BusinessException para violações de regra de negócio

- Máximo 30 linhas por método — se maior, extrair métodos privados

### 6.3 Entidades JPA

- Usar @Getter @Setter (NUNCA @Data em entidades — problemas com hashCode)

- @Column(name = "valor_aluguel") explícito para garantir snake_case

- @CreatedDate e @LastModifiedDate com JPA Auditing habilitado

- @Where(clause = "ativo = true") para soft delete automático

### 6.4 Validações

- DTOs: @NotBlank, @NotNull, @Size, @Positive, @Email

- Custom validators: @CpfValido (anotação customizada)

- Service: regras de negócio (imóvel disponível, CPF único)

# 7. Padrões de Código Angular (Welton)

### 7.1 Componentes

- ChangeDetectionStrategy.OnPush quando possível (performance)

- Tipar TUDO — nunca usar 'any'

- Async pipe no template para Observables (evita memory leaks)

- Máximo 200 linhas por componente — dividir se maior

- trackBy em \*ngFor para performance em listas

### 7.2 Services

- Retornar sempre Observable\<T\> (nunca fazer subscribe dentro do Service)

- URL da API como readonly property

- catchError + throwError para tratamento de erros

### 7.3 Formulários

- SEMPRE Reactive Forms (FormBuilder, FormGroup)

- Validações customizadas em shared/validators/

- \<mat-error\> para exibir erros abaixo do campo

- ngx-mask para máscaras: CPF, telefone, CEP, moeda

### 7.4 Estilização

- Angular Material como base — não reinventar componentes
- **CSS custom properties** (variáveis CSS no `:root`) para cores e tokens — definidas em `styles.scss`
- **Nunca hardcode de cor** fora de `styles.scss` — usar `var(--primary)`, `var(--text-muted)`, etc.
- Mobile-first: `@media (max-width: 768px)` para ajustes responsivos
- `!important` é permitido **exclusivamente** para sobrescrever estilos internos do Angular Material MDC (ex.: backgrounds de botões, bordas de inputs). Evitar em lógica de negócio visual própria
- Estilos globais compartilhados (badges, tabelas, empty-state, action-btn) devem ficar em `styles.scss` — não duplicar em componentes

### 7.5 Interfaces / Models

> // models/imovel.model.ts
 export interface Imovel {
 id: number;
 endereco: string;
 cep: string;
 cidade: string;
 tipo: 'CASA' \| 'APARTAMENTO' \| 'SALA_COMERCIAL';
 status: 'DISPONIVEL' \| 'ALUGADO' \| 'MANUTENCAO';
 valorAluguel: number;
 }
 // models/page.model.ts
 export interface Page\<T\> {
 content: T\[\];
 page: number;
 size: number;
 totalElements: number;
 totalPages: number;
 }

# 8. Padrões de Git

## 8.1 Conventional Commits (Obrigatório)

Formato:

> \<tipo\>(\<escopo\>): \<descrição curta em português\>

|          |                     |                                                |
|----------|---------------------|------------------------------------------------|
| **Tipo** | **Quando usar**     | **Exemplo**                                    |
| feat     | Nova funcionalidade | feat(imoveis): criar endpoint POST /imoveis    |
| fix      | Correção de bug     | fix(auth): corrigir expiração do token JWT     |
| docs     | Documentação        | docs(readme): adicionar instruções de setup    |
| style    | Formatação          | style(imoveis): aplicar prettier no component  |
| refactor | Refatoração         | refactor(service): extrair método de validação |
| test     | Testes              | test(imoveis): testes unitários ImovelService  |
| chore    | Manutenção          | chore(deps): atualizar Spring Boot para 3.2.4  |

**Exemplos:**

> ✅ feat(contratos): implementar encerramento automático de contrato
 ✅ fix(pagamentos): corrigir cálculo de atraso no scheduler
 ❌ update
 ❌ fix stuff
 ❌ WIP

## 8.2 Fluxo de Branches

> 1\. git checkout develop && git pull origin develop
 2\. git checkout -b feature/back-crud-imoveis \# Erick
 git checkout -b feature/front-crud-imoveis \# Welton
 3\. \# Desenvolver + commits frequentes
 4\. git push origin feature/back-crud-imoveis
 5\. \# Abrir Pull Request para develop no GitHub
 6\. \# O OUTRO dev faz code review e aprova
 7\. \# Merge em develop após aprovação

**Regras:**

- NUNCA commitar direto em main ou develop

- Branches Erick: feature/back-\*, fix/back-\*

- Branches Welton: feature/front-\*, fix/front-\*

- Pull Request obrigatório para merge em develop

- Squash merge para manter histórico limpo

# 9. Code Review Cruzado

Obrigatório: Erick revisa código do Welton. Welton revisa código do Erick.

## 9.1 Welton revisando Erick (Back-End)

- Endpoint segue o Contrato da API? (URL, método HTTP, DTO correto)

- Resposta está no formato combinado? (paginação, erro padrão)

- Filtro por usuario_id está aplicado? (isolamento de dados)

- Códigos HTTP corretos? (201 para POST, 204 para DELETE)

- Validações presentes? (@Valid, regras de negócio no Service)

- Swagger documentado? (@Tag, @Operation, @ApiResponse)

## 9.2 Erick revisando Welton (Front-End)

- Consome a API corretamente? (URL, método, DTO)

- Tratamento de erros implementado? (401 → login, 400 → campos)

- Loading states presentes? (spinner enquanto carrega)

- Empty states presentes? (mensagem quando lista vazia)

- Formulário valida antes de enviar? (botão disabled se inválido)

- Responsivo? (funciona em mobile)

- Sem 'any' no TypeScript?

## 9.3 Checklist do PR (Pull Request)

|        |                                     |                   |
|--------|-------------------------------------|-------------------|
| **\#** | **Verificação**                     | **Quem verifica** |
| 1      | Código compila sem erros            | Autor             |
| 2      | Testes passando                     | Autor             |
| 3      | Conventional Commits                | Revisor           |
| 4      | Segue padrão de nomenclatura        | Revisor           |
| 5      | Sem código comentado ou console.log | Revisor           |
| 6      | Segue contrato da API               | Revisor           |
| 7      | Sem TODO sem issue associada        | Revisor           |

# 10. Padrão Visual / UI Design (Welton)

Esta seção define o padrão visual que Welton deve seguir em todas as telas do Alugix.

## 10.0 Tema

O Alugix utiliza **tema claro único**. Dark mode foi avaliado e descartado para manter foco na entrega das funcionalidades principais. Não há `ThemeService`, sem toggle de tema, sem classe `.dark-theme`.

> **Decisão técnica (Sprint 8):** dark mode removido do escopo para priorizar qualidade e responsividade do tema claro.

## 10.1 Paleta de Cores (Design Tokens)

Definida em `styles.scss` via CSS custom properties no `:root`:

| **Token CSS**     | **Hex**             | **Onde usar**                            |
|-------------------|---------------------|------------------------------------------|
| `--primary`       | `#1565C0`           | Botões principais, links, page active    |
| `--primary-dark`  | `#0D47A1`           | Hover de botões, sidebar escura          |
| `--primary-light` | `#1976D2`           | Hovers suaves, bordas ativas             |
| `--accent`        | `#26A69A`           | Badges de destaque, elementos secundários|
| `--warn`          | `#E53935`           | Erros, exclusão, alertas críticos        |
| `--bg`            | `#F4F6F9`           | Background geral da aplicação            |
| `--surface`       | `#FFFFFF`           | Cards, modais, tabelas                   |
| `--border`        | `#E2E8F0`           | Bordas de campos e divisores             |
| `--text`          | `#1E293B`           | Texto principal                          |
| `--text-muted`    | `#64748B`           | Labels, subtítulos, cabeçalhos de tabela |
| `--text-light`    | `#94A3B8`           | Placeholder, ícones secundários          |
| `--sidebar-from`  | `#0d1f35`           | Início do gradiente da sidebar           |
| `--sidebar-to`    | `#1B4F72`           | Fim do gradiente da sidebar              |
| `--radius-sm`     | `6px`               | Chips, badges                            |
| `--radius-md`     | `10px`              | Botões, inputs                           |
| `--radius-lg`     | `16px`              | Cards, modais                            |

**Tema Angular Material configurado em `styles.scss`:**

```scss
$alugix-primary: mat.m2-define-palette(mat.$m2-blue-palette, 800, 600, 900);
$alugix-accent:  mat.m2-define-palette(mat.$m2-teal-palette, 400, 200, 700);
$alugix-warn:    mat.m2-define-palette(mat.$m2-red-palette);
```

## 10.4 Layout Principal

O layout segue o padrão SPA com sidebar fixa em desktop e overlay em mobile:

```
┌───────────┬────────────────────────────────────────┐
│           │  Toolbar (avatar + nome + botão logout) │
│  Sidebar  ├────────────────────────────────────────┤
│  (240px)  │                                        │
│           │  Conteúdo Principal (<router-outlet>)  │
│ Dashboard │                                        │
│  Imóveis  │  - Cards / Tabelas / Formulários       │
│ Inquilin. │                                        │
│ Contratos │                                        │
│   Admin   │                                        │
└───────────┴────────────────────────────────────────┘
```

- **Sidebar:** 240px fixa em desktop; em mobile vira overlay (`mode="over"`) com fechamento ao clicar no link (`@Output linkClicked`) — implementado via `BreakpointObserver`
- **Toolbar:** 64px de altura; avatar com iniciais do usuário + nome + botão de logout inline (sem dropdown)
- **Conteúdo:** padding 24px (16px em mobile), scroll vertical e horizontal habilitados
- **Componente:** `MainLayoutComponent` em `layout/main-layout/`

## 10.5 Componentes de UI Padrão

|                    |                                            |                                                  |
|--------------------|--------------------------------------------|--------------------------------------------------|
| **Componente**     | **Quando usar**                            | **Implementação**                                |
| Tabela de listagem | Imóveis, inquilinos, contratos, usuários   | `mat-table` + `app-pagination` (customizado)     |
| Paginação          | Rodapé de todas as listagens               | `PaginationComponent` em `shared/components/pagination/` — desktop (Anterior/números/Próxima) + mobile (< página >) |
| Formulário modal   | Cadastro e edição rápida                   | `MatDialog` + `Reactive Form` — `maxWidth: '95vw'` obrigatório para responsividade |
| Cards de resumo    | Dashboard (totais)                         | `mat-card` com ícone + número animado (countUp) + label |
| Badge de status    | Status em listas e detalhes                | Classe CSS global `.status-badge` com variantes (`.status-disponivel`, `.status-ativo`, etc.) |
| Dialog confirmação | Exclusão, toggle ativo/inativo, encerramento | `ConfirmDialogComponent` em `shared/components/confirm-dialog/` |
| Snackbar           | Feedback após ações                        | `MatSnackBar` (3s, posição bottom-right)         |
| Loading overlay    | Enquanto carrega dados em tabela           | `.loading-overlay` com `mat-spinner` (classe global em `styles.scss`) |
| Empty state        | Lista sem resultados                       | `.empty-state` com `mat-icon` + texto + botão (classe global) |
| Botões de ação     | Ações inline nas tabelas (editar, excluir) | `.action-btn` com variantes `.edit`, `.delete`, `.view`, `.toggle` + `matTooltip` obrigatório |

## 10.6 Padrão de Badges de Status

Implementados como classes CSS globais em `styles.scss`. Uso: `<span class="status-badge status-disponivel">Disponível</span>`. Sem bolinha/dot — apenas texto com borda colorida.

|                        |                  |           |                  |                                |
|------------------------|------------------|-----------|------------------|--------------------------------|
| **Classe CSS**         | **Fundo**        | **Texto** | **Borda**        | **Aplica-se a**                |
| `.status-disponivel`   | `#ECFDF5`        | `#065F46` | `#A7F3D0`        | Imóveis                        |
| `.status-alugado`      | `#EFF6FF`        | `#1E40AF` | `#BFDBFE`        | Imóveis                        |
| `.status-manutencao`   | `#FFF7ED`        | `#9A3412` | `#FED7AA`        | Imóveis                        |
| `.status-ativo`        | `#ECFDF5`        | `#065F46` | `#A7F3D0`        | Contratos                      |
| `.status-encerrado`    | `#F8FAFC`        | `#475569` | `#CBD5E1`        | Contratos                      |
| `.status-atrasado`     | `#FEF2F2`        | `#991B1B` | `#FEE2E2`        | Contratos, Pagamentos          |
| `.status-pago`         | `#ECFDF5`        | `#065F46` | `#A7F3D0`        | Pagamentos                     |
| `.status-pendente`     | `#FFFBEB`        | `#92400E` | `#FDE68A`        | Pagamentos                     |
| `.badge-situacao.ativo`   | `#ECFDF5`     | `#065F46` | `#A7F3D0`        | Inquilinos/Usuários (ativo)    |
| `.badge-situacao.inativo` | `#F8FAFC`     | `#64748B` | `#CBD5E1`        | Inquilinos/Usuários (inativo)  |
| `.badge-perfil`           | `#EFF6FF`     | `#1E40AF` | `#BFDBFE`        | Usuários (USUARIO)             |
| `.badge-perfil.admin`     | `#FDF4FF`     | `#7E22CE` | `#E9D5FF`        | Usuários (ADMIN)               |

## 10.7 Responsividade

|                |                |                                                                  |
|----------------|----------------|------------------------------------------------------------------|
| **Breakpoint** | **Largura**    | **Layout**                                                       |
| Desktop        | > 768px        | Sidebar fixa (240px) + conteúdo lado a lado                      |
| Mobile         | ≤ 768px        | Sidebar overlay (hamburger abre/fecha) + conteúdo full width     |

**Regras implementadas:**

- **Tabelas em mobile:** scroll horizontal (`overflow-x: auto` + `min-width` na `table`) — **não usar cards**
- **Formulários modais:** `.two-cols` e `.three-cols` colapsam para 1 coluna em ≤ 600px; `dialog.open()` sempre com `maxWidth: '95vw'`
- **Filtros de listagem:** em mobile (≤ 768px), usam `.filtros-container` que muda para `flex-direction: column` + campos `width: 100%`
- **Sidebar mobile:** `BreakpointObserver('(max-width: 768px)')` troca `mode` de `side` para `over`; fecha automaticamente ao selecionar um link
- **Viewport mobile:** `height: 100dvh` no layout para evitar corte de barra de endereço
- **Login mobile:** card em glassmorphism centralizado com scroll desabilitado (`height: 100dvh; overflow: hidden`)

## 10.8 Sistema de Tabelas Global (styles.scss)

Todas as telas de listagem usam classes CSS globais definidas em `styles.scss`. Não deve haver estilos de tabela duplicados em SCSSs de componentes.

| **Classe global**      | **Uso**                                                    |
|------------------------|------------------------------------------------------------|
| `.page-container`      | Wrapper flex coluna da página                              |
| `.page-header`         | Cabeçalho com título e botão de ação                       |
| `.page-title`          | Título da página (`h1`)                                    |
| `.page-subtitle`       | Subtítulo descritivo                                       |
| `.filtros-container`   | Container flex de filtros (colapsa para coluna no mobile)  |
| `.filtro-field`        | Campo de filtro select (200px desktop / 100% mobile)       |
| `.busca-field`         | Campo de busca textual (300px desktop / 100% mobile)       |
| `.table-container`     | Wrapper da tabela (borda, shadow, scroll horizontal)       |
| `.loading-overlay`     | Spinner sobreposto à tabela durante carregamento           |
| `.empty-state`         | Estado vazio com ícone + mensagem                          |
| `.entity-nome-cell`    | Célula de nome com ícone à esquerda                        |
| `.entity-icon-wrap`    | Container do ícone (variantes: `.blue`, `.green`, `.purple`, `.orange`) |
| `.entity-nome`         | Nome principal em negrito                                  |
| `.entity-sub`          | Subtítulo abaixo do nome                                   |
| `.muted-cell`          | Célula com texto secundário (cinza, 13px)                  |
| `.valor-chip`          | Chip verde para valores monetários                         |
| `.action-btn`          | Botão de ação inline (variantes: `.edit`, `.delete`, `.view`, `.manut`, `.toggle`, `.close`) |
| `.toggle-btn`          | Botão toggle ativo/inativo (`.toggle-on` verde / `.toggle-off` cinza) |
| `.acoes-cell`          | Container flex centralizado de botões de ação              |

**Regra:** todo `matTooltip` é **obrigatório** em botões de ação — o usuário deve saber o que cada ícone faz.

## 10.9 Tipografia

|                       |          |             |               |
|-----------------------|----------|-------------|---------------|
| **Elemento**          | **Font** | **Tamanho** | **Peso**      |
| Título da página (h1) | Roboto   | 24px        | 500 (Medium)  |
| Subtítulo (h2)        | Roboto   | 20px        | 500           |
| Label de card         | Roboto   | 14px        | 400 (Regular) |
| Corpo de texto        | Roboto   | 14px        | 400           |
| Valor numérico grande | Roboto   | 32px        | 700 (Bold)    |
| Caption / helper      | Roboto   | 12px        | 400           |

# 11. Checklist de Qualidade

Antes de abrir um PR, verifique todos os itens aplicáveis:

## 11.1 Checklist do Erick (Back-End)

|        |                                                     |         |
|--------|-----------------------------------------------------|---------|
| **\#** | **Item**                                            | **OK?** |
| 1      | Endpoint segue o Contrato da API (URL, método, DTO) | ⬜      |
| 2      | @Valid nos DTOs de entrada                          | ⬜      |
| 3      | Filtro por usuario_id aplicado                      | ⬜      |
| 4      | Exceções tratadas (ResourceNotFound, Business)      | ⬜      |
| 5      | Status HTTP correto (200, 201, 204, 400, 404)       | ⬜      |
| 6      | Paginação implementada nas listagens                | ⬜      |
| 7      | Swagger documentado (@Tag, @Operation)              | ⬜      |
| 8      | Testes unitários do Service escritos                | ⬜      |
| 9      | Sem System.out.println (usar Logger)                | ⬜      |
| 10     | Conventional Commit na mensagem                     | ⬜      |

## 11.2 Checklist do Welton (Front-End)

|        |                                                                              |         |
|--------|------------------------------------------------------------------------------|---------|
| **\#** | **Item**                                                                     | **OK?** |
| 1      | Consome API conforme Contrato (URL, DTO)                                     | ⬜      |
| 2      | Loading state enquanto carrega dados (`.loading-overlay`)                    | ⬜      |
| 3      | Empty state quando lista vazia (`.empty-state`)                              | ⬜      |
| 4      | Erros tratados (401→login, 400→campos, 500→mensagem)                         | ⬜      |
| 5      | Formulário valida antes de submeter                                          | ⬜      |
| 6      | Máscaras aplicadas (CPF, telefone, CEP, moeda)                               | ⬜      |
| 7      | Responsivo em mobile (≤ 768px): tabela scroll horizontal, filtros empilhados | ⬜      |
| 8      | Modais com `maxWidth: '95vw'` para funcionar em mobile                       | ⬜      |
| 9      | Todos botões de ação possuem `matTooltip`                                    | ⬜      |
| 10     | Cores e estilos usando tokens CSS (`var(--primary)`, etc.) — sem hardcode    | ⬜      |
| 11     | Sem 'any' no TypeScript                                                      | ⬜      |
| 12     | Sem console.log no código final                                              | ⬜      |
| 13     | Conventional Commit na mensagem                                              | ⬜      |

*Fim do Guia — Código bom = padrão seguido! 🚀*
