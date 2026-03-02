**ALUGIX**

Contrato da API REST

Endpoints • DTOs • Códigos de Erro • Autenticação

*Fonte de verdade entre Erick (Back) e Welton (Front)*

**Versão 1.0 — Fevereiro de 2026**

Base URL: http://localhost:8080/api/v1

**Sumário**

# 1. Informações Gerais

# 2. Autenticação (JWT)

# 3. Padrão de Respostas

# 4. Códigos de Erro

# 5. /auth — Autenticação

# 6. /usuarios — Usuários

# 7. /imoveis — Imóveis

# 8. /inquilinos — Inquilinos

# 9. /contratos — Contratos

# 10. /pagamentos — Pagamentos

# 11. /dashboard — Dashboard

# 12. Resumo de DTOs

# 1. Informações Gerais

|               |                                       |
|---------------|---------------------------------------|
| **Item**      | **Valor**                             |
| Base URL      | http://localhost:8080/api/v1          |
| Formato       | JSON (application/json)               |
| Autenticação  | Bearer Token (JWT)                    |
| Paginação     | ?page=0&size=10&sort=campo,asc        |
| Versionamento | Via URL (/api/v1/)                    |
| CORS          | localhost:4200 (dev)                  |
| Swagger       | http://localhost:8080/swagger-ui.html |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>💡 COMO USAR</strong></p>
<p>Erick implementa os endpoints exatamente como descrito. Welton consome usando os mesmos DTOs e URLs. Alterações devem ser feitas NESTE DOCUMENTO antes de implementar.</p></td>
</tr>
</tbody>
</table>

# 2. Autenticação (JWT)

Todas as requisições (exceto /auth/login e /auth/forgot-password) exigem:

> Authorization: Bearer \<token_jwt\>

**Claims do token:**

|           |          |                  |
|-----------|----------|------------------|
| **Claim** | **Tipo** | **Descrição**    |
| sub       | String   | ID do usuário    |
| email     | String   | E-mail           |
| role      | String   | ADMIN ou USUARIO |
| exp       | Long     | Expiração (24h)  |

Welton: armazenar token no localStorage, incluir via TokenInterceptor. Ao receber 401 → redirecionar para /login.

# 3. Padrão de Respostas

## 3.1 Sucesso (objeto)

> {
 "id": 1,
 "nome": "Apt Centro",
 "status": "DISPONIVEL"
 }

## 3.2 Sucesso (paginado)

> {
 "content": \[ {...}, {...} \],
 "page": 0, "size": 10,
 "totalElements": 47, "totalPages": 5,
 "last": false
 }

## 3.3 Erro

> {
 "timestamp": "2026-03-15T10:30:00Z",
 "status": 400,
 "error": "Bad Request",
 "message": "CPF já cadastrado",
 "path": "/api/v1/inquilinos",
 "errors": \[{ "field": "cpf", "message": "CPF já existe" }\]
 }

# 4. Códigos de Erro

|            |               |                       |                         |
|------------|---------------|-----------------------|-------------------------|
| **Código** | **Status**    | **Quando**            | **Ação Front (Welton)** |
| 200        | OK            | Sucesso               | Processar normalmente   |
| 201        | Created       | Recurso criado        | Listagem + snackbar     |
| 204        | No Content    | Excluído              | Remover da lista        |
| 400        | Bad Request   | Validação falhou      | Erros nos campos        |
| 401        | Unauthorized  | Token inválido        | Redirecionar /login     |
| 403        | Forbidden     | Sem permissão         | Mensagem acesso negado  |
| 404        | Not Found     | Não encontrado        | Página 404              |
| 409        | Conflict      | Ex: imóvel já alugado | Mensagem específica     |
| 422        | Unprocessable | Regra violada         | Mensagem do back        |
| 500        | Server Error  | Erro interno          | Mensagem genérica       |

# 5. /auth — Autenticação

## POST /api/v1/auth/login

Acesso: Público. Retorna token JWT.

**Request:**

> {
 "email": "erick@alugix.com",
 "senha": "MinhaSenh@123"
 }

**Response 200:**

> {
 "token": "eyJhbG...",
 "tipo": "Bearer",
 "expiracaoMs": 86400000,
 "usuario": {
 "id": 1, "nome": "Erick",
 "email": "erick@alugix.com", "perfil": "ADMIN"
 }
 }

## POST /api/v1/auth/refresh

Renova token. Requer token válido. Resposta: mesmo formato do login.

## POST /api/v1/auth/forgot-password

Acesso: Público. Request: { "email": "..." }. Response: { "message": "E-mail enviado" }

# 6. /usuarios — Usuários (Somente Admin)

|            |                                 |               |
|------------|---------------------------------|---------------|
| **Método** | **Endpoint**                    | **Descrição** |
| GET        | /api/v1/usuarios?page=0&size=10 | Listar        |
| GET        | /api/v1/usuarios/{id}           | Detalhar      |
| POST       | /api/v1/usuarios                | Criar         |
| PUT        | /api/v1/usuarios/{id}           | Editar        |
| DELETE     | /api/v1/usuarios/{id}           | Desativar     |

**UsuarioRequestDTO:**

> {
 "nome": "string (obrigatório, max 150)",
 "email": "string (unique, formato email)",
 "senha": "string (obrig. no POST, min 8)",
 "perfil": "ADMIN \| USUARIO"
 }

**UsuarioResponseDTO:**

> {
 "id": 1, "nome": "Erick",
 "email": "erick@alugix.com",
 "perfil": "ADMIN", "ativo": true,
 "createdAt": "2026-03-01T10:00:00Z"
 }

# 7. /imoveis — Imóveis

Autenticado. Usuário vê só seus. Admin vê todos.

|            |                                                    |                |
|------------|----------------------------------------------------|----------------|
| **Método** | **Endpoint**                                       | **Descrição**  |
| GET        | /api/v1/imoveis?status=DISPONIVEL&tipo=APARTAMENTO | Listar         |
| GET        | /api/v1/imoveis/{id}                               | Detalhar       |
| POST       | /api/v1/imoveis                                    | Cadastrar      |
| PUT        | /api/v1/imoveis/{id}                               | Editar         |
| DELETE     | /api/v1/imoveis/{id}                               | Excluir (soft) |

**Query Params:**

|           |          |                         |
|-----------|----------|-------------------------|
| **Param** | **Tipo** | **Exemplo**             |
| page      | int      | ?page=0                 |
| size      | int      | &size=20                |
| sort      | string   | &sort=valorAluguel,desc |
| status    | enum     | &status=DISPONIVEL      |
| tipo      | enum     | &tipo=CASA              |
| cidade    | string   | &cidade=Recife          |

**ImovelRequestDTO:**

> {
 "endereco": "string (obrig., max 300)",
 "cep": "string (99999-999)",
 "cidade": "string (max 100)",
 "estado": "string (2 chars, ex: PE)",
 "tipo": "CASA \| APARTAMENTO \| SALA_COMERCIAL",
 "quartos": "int (min 0)",
 "banheiros": "int (min 0)",
 "areaM2": "decimal (opcional)",
 "valorAluguel": "decimal (obrig., \> 0)",
 "descricao": "string (opcional)"
 }

**ImovelResponseDTO:**

> {
 "id": 1, "endereco": "Rua Boa Vista, 100",
 "cep": "50050-010", "cidade": "Recife", "estado": "PE",
 "tipo": "APARTAMENTO", "quartos": 2, "banheiros": 1,
 "areaM2": 65.50, "valorAluguel": 1500.00,
 "status": "DISPONIVEL",
 "descricao": "Próximo ao metrô",
 "createdAt": "2026-03-01T10:00:00Z"
 }

**Enums:**

- Status: DISPONIVEL, ALUGADO, MANUTENCAO

- Tipo: CASA, APARTAMENTO, SALA_COMERCIAL

# 8. /inquilinos — Inquilinos

Autenticado. Isolamento por usuario_id.

|            |                                 |               |
|------------|---------------------------------|---------------|
| **Método** | **Endpoint**                    | **Descrição** |
| GET        | /api/v1/inquilinos?status=ATIVO | Listar        |
| GET        | /api/v1/inquilinos/{id}         | Detalhar      |
| POST       | /api/v1/inquilinos              | Cadastrar     |
| PUT        | /api/v1/inquilinos/{id}         | Editar        |
| DELETE     | /api/v1/inquilinos/{id}         | Desativar     |

**InquilinoRequestDTO:**

> {
 "nome": "string (obrig., max 200)",
 "cpf": "string (999.999.999-99, unique/usuário)",
 "telefone": "string ((99) 99999-9999)",
 "email": "string (opcional)",
 "rendaMensal": "decimal (opcional)"
 }

**InquilinoResponseDTO:**

> {
 "id": 1, "nome": "João Silva",
 "cpf": "123.456.789-00",
 "telefone": "(81) 99999-1234",
 "email": "joao@email.com",
 "rendaMensal": 5000.00, "status": "ATIVO",
 "createdAt": "2026-03-01T10:00:00Z"
 }

# 9. /contratos — Contratos

Autenticado. Regras automáticas de negócio.

|            |                                 |               |
|------------|---------------------------------|---------------|
| **Método** | **Endpoint**                    | **Descrição** |
| GET        | /api/v1/contratos?status=ATIVO  | Listar        |
| GET        | /api/v1/contratos/{id}          | Detalhar      |
| POST       | /api/v1/contratos               | Criar         |
| PUT        | /api/v1/contratos/{id}          | Editar        |
| PATCH      | /api/v1/contratos/{id}/encerrar | Encerrar      |

**ContratoRequestDTO:**

> {
 "imovelId": "long (imóvel DISPONIVEL)",
 "inquilinoId": "long (inquilino ATIVO)",
 "valorAluguel": "decimal (\> 0)",
 "dataInicio": "yyyy-MM-dd",
 "dataTermino": "yyyy-MM-dd (\> dataInicio)",
 "diaVencimento": "int (1-31)",
 "observacoes": "string (opcional)"
 }

**ContratoResponseDTO:**

> {
 "id": 1,
 "imovel": { "id": 5, "endereco": "Rua Boa Vista", "tipo": "APARTAMENTO" },
 "inquilino": { "id": 3, "nome": "João Silva", "cpf": "123.456.789-00" },
 "valorAluguel": 1500.00,
 "dataInicio": "2026-04-01", "dataTermino": "2027-03-31",
 "diaVencimento": 10, "status": "ATIVO",
 "createdAt": "2026-03-15T10:00:00Z"
 }

**Regras automáticas (Erick):**

- POST → Imóvel vira ALUGADO + gera pagamentos PENDENTE

- PATCH encerrar → Imóvel volta DISPONIVEL + status ENCERRADO

- Imóvel já ALUGADO → 409 Conflict

- Status: ATIVO, ATRASADO, ENCERRADO

# 10. /pagamentos — Pagamentos

|            |                                           |                     |
|------------|-------------------------------------------|---------------------|
| **Método** | **Endpoint**                              | **Descrição**       |
| GET        | /api/v1/contratos/{contratoId}/pagamentos | Listar do contrato  |
| PATCH      | /api/v1/pagamentos/{id}/pagar             | Registrar pagamento |

**PagamentoRegistroDTO (PATCH /pagar):**

> {
 "valorPago": "decimal (\> 0)",
 "dataPagamento": "yyyy-MM-dd",
 "formaPagamento": "PIX \| BOLETO \| TRANSFERENCIA \| DINHEIRO",
 "observacoes": "string (opcional)"
 }

**PagamentoResponseDTO:**

> {
 "id": 1, "contratoId": 1,
 "mesReferencia": "2026-04-01",
 "valorPago": 1500.00,
 "dataPagamento": "2026-04-09",
 "dataVencimento": "2026-04-10",
 "status": "PAGO", "formaPagamento": "PIX"
 }

- Status: PENDENTE, PAGO, ATRASADO

# 11. /dashboard — Dashboard

Autenticado. Usuário = próprios dados. Admin = globais.

|            |                                            |                       |
|------------|--------------------------------------------|-----------------------|
| **Método** | **Endpoint**                               | **Descrição**         |
| GET        | /api/v1/dashboard/resumo                   | Contagens da carteira |
| GET        | /api/v1/dashboard/receita?meses=6          | Prevista vs recebida  |
| GET        | /api/v1/dashboard/inadimplencia            | Contratos atrasados   |
| GET        | /api/v1/dashboard/contratos-vencer?dias=30 | Próximos do término   |

**DashboardResumoDTO:**

> {
 "totalImoveis": 15, "imoveisAlugados": 10,
 "imoveisDisponiveis": 4, "imoveisManutencao": 1,
 "totalContratos": 12, "contratosAtivos": 10,
 "contratosAtrasados": 2, "totalInquilinos": 11
 }

**ReceitaMensalDTO (array):**

> \[
 { "mes": "2026-03", "prevista": 15000.00, "recebida": 13500.00 },
 { "mes": "2026-02", "prevista": 15000.00, "recebida": 15000.00 }
 \]

# 12. Resumo de Todos os DTOs

|                      |                        |                                                                             |
|----------------------|------------------------|-----------------------------------------------------------------------------|
| **DTO**              | **Usado em**           | **Campos-chave**                                                            |
| LoginRequestDTO      | POST /auth/login       | email, senha                                                                |
| LoginResponseDTO     | Resp /auth/login       | token, tipo, expiracaoMs, usuario                                           |
| UsuarioRequestDTO    | POST/PUT /usuarios     | nome, email, senha, perfil                                                  |
| UsuarioResponseDTO   | GET /usuarios          | id, nome, email, perfil, ativo                                              |
| ImovelRequestDTO     | POST/PUT /imoveis      | endereco, cep, cidade, estado, tipo, quartos, banheiros, valorAluguel       |
| ImovelResponseDTO    | GET /imoveis           | id + request + status, createdAt                                            |
| InquilinoRequestDTO  | POST/PUT /inquilinos   | nome, cpf, telefone, email, rendaMensal                                     |
| InquilinoResponseDTO | GET /inquilinos        | id + request + status, createdAt                                            |
| ContratoRequestDTO   | POST/PUT /contratos    | imovelId, inquilinoId, valorAluguel, dataInicio, dataTermino, diaVencimento |
| ContratoResponseDTO  | GET /contratos         | id, imovel(resumo), inquilino(resumo), status                               |
| PagamentoRegistroDTO | PATCH /pagar           | valorPago, dataPagamento, formaPagamento                                    |
| PagamentoResponseDTO | GET /pagamentos        | id, contratoId, mesReferencia, status                                       |
| DashboardResumoDTO   | GET /dashboard/resumo  | totalImoveis, alugados, disponiveis                                         |
| ReceitaMensalDTO     | GET /dashboard/receita | mes, prevista, recebida                                                     |

*Fim do Contrato da API — Fonte de verdade Erick ↔ Welton*
