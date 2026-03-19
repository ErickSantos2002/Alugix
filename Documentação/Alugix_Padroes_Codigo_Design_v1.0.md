**ALUGIX**

Guia de Padrões de Código e Design

Design Patterns • Nomenclatura • Arquitetura • Git • UI Design

*Regras obrigatórias para Erick (Back) e Welton (Front)*

**Versão 1.0 — Fevereiro de 2026**

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
 │ ├── components/ // confirm-dialog/, loading-spinner/, status-badge/
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

- Variáveis SCSS para cores do tema (nunca hardcode)

- Mobile-first: @media (min-width: ...)

- Nunca usar !important

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

## 10.0 Suporte a Tema Claro / Escuro

O Alugix suporta **dois temas**: claro (padrão) e escuro (dark mode).

- O tema padrão ao abrir o sistema é o **claro**
- O usuário pode alternar via **botão na toolbar** (ícone `light_mode` / `dark_mode`)
- A preferência é salva no `localStorage` com a chave `alugix-theme`
- Implementado via CSS custom properties + classe `.dark-theme` no `<body>`
- **Nunca usar cores hardcoded** — sempre via variável CSS ou token do Angular Material

## 10.1 Paleta de Cores

### Tema Claro (padrão)

| **Uso**        | **Cor**     | **Hex**   | **Onde usar**                       |
|----------------|-------------|-----------|-------------------------------------|
| Primária       | Azul escuro | `#1B4F72` | Sidebar, headers, botões principais |
| Primária Light | Azul claro  | `#2E86C1` | Links, hovers, destaques            |
| Secundária     | Verde       | `#27AE60` | Botões de sucesso, badges 'Ativo'   |
| Alerta         | Amarelo     | `#F39C12` | Badges 'Pendente', avisos           |
| Erro           | Vermelho    | `#E74C3C` | Badges 'Atrasado', erros, exclusão  |
| Texto          | Cinza escuro| `#2C3E50` | Texto principal                     |
| Texto suave    | Cinza médio | `#7F8C8D` | Labels, subtítulos                  |
| Surface        | Cinza claro | `#ECF0F1` | Backgrounds alternativos            |
| Background     | Branco      | `#FFFFFF` | Fundo principal dos cards           |

### Tema Escuro (dark mode)

| **Uso**        | **Cor**          | **Hex**   | **Onde usar**                          |
|----------------|------------------|-----------|----------------------------------------|
| Primária       | Azul médio       | `#2E86C1` | Sidebar, headers, botões principais    |
| Primária Light | Azul claro       | `#5DADE2` | Links, hovers, destaques              |
| Secundária     | Verde            | `#27AE60` | Botões de sucesso, badges 'Ativo'      |
| Alerta         | Amarelo          | `#F39C12` | Badges 'Pendente', avisos              |
| Erro           | Vermelho         | `#E74C3C` | Badges 'Atrasado', erros, exclusão     |
| Texto          | Branco suave     | `#E8EDF2` | Texto principal                        |
| Texto suave    | Azul acinzentado | `#8FA3B3` | Labels, subtítulos                     |
| Surface        | Azul escuro      | `#1E2D3E` | Cards, modais, formulários             |
| Background     | Azul muito escuro| `#0F1923` | Fundo geral da aplicação               |
| Sidebar        | Azul quase preto | `#0D1B2A` | Sidebar (mais escuro que o background) |
| Borda          | Azul escuro suave| `#2A3F54` | Bordas de cards e inputs               |

> **Racional das cores dark:** o azul escuro naval (`#0F1923`) foi escolhido por dar um aspecto premium e profissional, muito usado em SaaS financeiros modernos. Evita o preto puro (`#000`) que causa alto contraste agressivo, e mantém identidade com o azul da marca.

**Configurar no styles.scss:**

```scss
// Tema Claro
$alugix-light-primary: #1B4F72;
$alugix-light-accent:  #27AE60;
$alugix-light-warn:    #E74C3C;
$alugix-light-bg:      #FFFFFF;
$alugix-light-surface: #ECF0F1;

// Tema Escuro
$alugix-dark-primary: #2E86C1;
$alugix-dark-accent:  #27AE60;
$alugix-dark-warn:    #E74C3C;
$alugix-dark-bg:      #0F1923;
$alugix-dark-surface: #1E2D3E;
```

## 10.2 Botão de Alternância de Tema

- **Local:** toolbar superior, lado direito (antes do avatar/logout)
- **Ícone claro:** `dark_mode` (lua) — clicando ativa o dark
- **Ícone escuro:** `light_mode` (sol) — clicando ativa o claro
- **Implementação:** `ThemeService` em `core/services/theme.service.ts`
- **Persistência:** `localStorage.setItem('alugix-theme', 'dark' | 'light')`

## 10.4 Layout Principal

O layout segue o padrão SPA com sidebar fixa:

> ┌───────────┬────────────────────────────────────────┐
 │ │ Toolbar (nome do usuário, logout) │
 │ Sidebar ├────────────────────────────────────────┤
 │ (240px) │ │
 │ │ Conteúdo Principal │
 │ Dashboard │ (\<router-outlet\>) │
 │ Imóveis │ │
 │ Inquilin. │ - Cards / Tabelas / Formulários │
 │ Contratos │ │
 │ Admin │ │
 └───────────┴────────────────────────────────────────┘

- Sidebar: 240px fixa em desktop, colapsável em mobile (mat-sidenav)

- Toolbar: 64px de altura, nome do usuário + avatar + botão logout

- Conteúdo: padding 24px, max-width 1200px centralizado

## 10.5 Componentes de UI Padrão

|                    |                                            |                                         |
|--------------------|--------------------------------------------|-----------------------------------------|
| **Componente**     | **Quando usar**                            | **Material Component**                  |
| Tabela de listagem | Imóveis, inquilinos, contratos, pagamentos | mat-table + mat-paginator + mat-sort    |
| Formulário modal   | Cadastro e edição rápida                   | MatDialog + Reactive Form               |
| Formulário página  | Cadastro complexo (contrato)               | Página dedicada + Stepper               |
| Cards de resumo    | Dashboard (totais)                         | mat-card com ícone + número + label     |
| Gráfico de barras  | Receita prevista vs recebida               | Chart.js (ng2-charts)                   |
| Badge de status    | Status em listas e detalhes                | mat-chip com cor dinâmica               |
| Dialog confirmação | Exclusão, encerramento                     | MatDialog com botões Cancelar/Confirmar |
| Snackbar           | Feedback após ações                        | MatSnackBar (3s, posição bottom-right)  |
| Loading spinner    | Enquanto carrega dados                     | mat-progress-spinner ou bar             |
| Empty state        | Lista sem resultados                       | Ilustração + texto + botão de ação      |

## 10.6 Padrão de Badges de Status

|            |                           |                  |                       |
|------------|---------------------------|------------------|-----------------------|
| **Status** | **Cor de fundo**          | **Cor do texto** | **Aplica-se a**       |
| DISPONIVEL | \#E8F5E9 (verde claro)    | \#2E7D32         | Imóveis               |
| ALUGADO    | \#E3F2FD (azul claro)     | \#1565C0         | Imóveis               |
| MANUTENCAO | \#FFF3E0 (laranja claro)  | \#E65100         | Imóveis               |
| ATIVO      | \#E8F5E9 (verde claro)    | \#2E7D32         | Contratos, Inquilinos |
| INATIVO    | \#ECEFF1 (cinza claro)    | \#546E7A         | Inquilinos            |
| ENCERRADO  | \#ECEFF1 (cinza claro)    | \#546E7A         | Contratos             |
| ATRASADO   | \#FFEBEE (vermelho claro) | \#C62828         | Contratos             |
| PAGO       | \#E8F5E9 (verde claro)    | \#2E7D32         | Pagamentos            |
| PENDENTE   | \#FFF3E0 (amarelo claro)  | \#E65100         | Pagamentos            |
| ATRASADO   | \#FFEBEE (vermelho claro) | \#C62828         | Pagamentos            |

## 10.7 Responsividade

|                |                |                                                 |
|----------------|----------------|-------------------------------------------------|
| **Breakpoint** | **Largura**    | **Layout**                                      |
| Desktop        | \> 1024px      | Sidebar fixa + conteúdo lado a lado             |
| Tablet         | 768px – 1024px | Sidebar colapsável (hamburger) + conteúdo full  |
| Mobile         | \< 768px       | Sem sidebar (menu hamburger) + cards empilhados |

**Regras:**

- Tabelas em mobile: usar cards em vez de colunas

- Formulários: 2 colunas em desktop, 1 coluna em mobile

- Botões de ação: FAB (floating action button) em mobile

## 10.8 Tipografia

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

|        |                                                      |         |
|--------|------------------------------------------------------|---------|
| **\#** | **Item**                                             | **OK?** |
| 1      | Consome API conforme Contrato (URL, DTO)             | ⬜      |
| 2      | Loading state enquanto carrega dados                 | ⬜      |
| 3      | Empty state quando lista vazia                       | ⬜      |
| 4      | Erros tratados (401→login, 400→campos, 500→mensagem) | ⬜      |
| 5      | Formulário valida antes de submeter                  | ⬜      |
| 6      | Máscaras aplicadas (CPF, telefone, CEP, moeda)       | ⬜      |
| 7      | Responsivo (testado em mobile e tablet)              | ⬜      |
| 8      | Sem 'any' no TypeScript                              | ⬜      |
| 9      | Sem console.log no código final                      | ⬜      |
| 10     | Conventional Commit na mensagem                      | ⬜      |

*Fim do Guia — Código bom = padrão seguido! 🚀*
