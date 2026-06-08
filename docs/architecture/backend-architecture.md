# Backend Architecture

## Purpose

This document defines the **backend architecture of the application**.

It describes:

- technology stack
- architectural layers
- folder structure
- code responsibilities
- backend design patterns
- backend quality gates

This document serves two main purposes:

1️⃣ Guide developers implementing the backend  
2️⃣ Provide **structured context for AI-assisted development (Copilot / LLMs)**

Because of this:

- architecture rules must be explicit
- layers must be clearly defined
- code responsibilities must be documented

This prevents AI tools from generating inconsistent backend code.

---

# Technology Stack

The backend uses the following stack:

Runtime: Node.js
Language: TypeScript
Framework: Express
ORM: Sequelize
Database: PostgreSQL
Authentication: short-lived JWT access token in HttpOnly cookie + rotating refresh session
Password hashing: bcrypt (12 rounds)
Environment config: dotenv
Security middleware: cookie-parser, helmet, express-rate-limit, cors
Backend automated testing: Vitest + Supertest + PostgreSQL test database

---

# Authentication Architecture

The backend uses cookie-based authentication with server-tracked sessions.

## Session lifecycle

1. User registers via `POST /api/v1/auth/register`.
2. User logs in via `POST /api/v1/auth/login`.
3. The backend validates credentials, creates an `auth_sessions` record, hashes and stores the refresh token, and signs a short-lived JWT access token with payload `{ id, email, sessionId }`.
4. The backend returns the authenticated user in the response body and sets two HttpOnly cookies:

```text
fc_access_token   -> short-lived JWT access token
fc_refresh_token  -> rotating opaque refresh token
```

5. The frontend sends requests with `withCredentials: true`; it does not store tokens in localStorage.
6. Protected routes validate the access token through `authMiddleware` and confirm that the referenced session still exists and is not revoked.
7. When the access token expires, the client refreshes the session through `POST /api/v1/auth/refresh`, which rotates the refresh token and issues a new access token cookie.
8. `req.user` is populated with `{ id, email, sessionId }` from the verified access token.
9. Controllers and services use `req.user.id` to resolve the authenticated user. User identity is never trusted from request bodies.

## Session persistence

Authenticated sessions are persisted in `auth_sessions`.

Each session stores:

- `user_id`
- `refresh_token_hash`
- `refresh_expires_at`
- `revoked_at`
- request metadata such as IP and user agent

This enables:

- rotating refresh tokens
- multi-session support per user
- immediate revocation on logout
- server-side invalidation for expired or revoked sessions

## Audit trail

Authentication events are stored in `auth_audit_logs`.

Current events include:

- `login_succeeded`
- `login_failed`
- `refresh_succeeded`
- `refresh_failed`
- `logout_succeeded`
- `session_invalid`

These records capture the user, session, email when available, IP address, user agent, and optional metadata.

## Middleware

`src/middlewares/auth.middleware.ts`

Reads the access token from the HttpOnly cookie, verifies the JWT, confirms the referenced session is active, and populates `req.user`. Missing or invalid auth cookies are forwarded to the centralized error handler as `401 Unauthorized` responses.

The middleware is applied **globally** in `src/routes/index.ts` immediately after the public auth and operational routes, protecting all resource routes without requiring per-route decoration.

Public routes (`register`, `login`, `refresh`, `logout`, `health`, `live`, `ready`, `metrics`) are registered before the global `router.use(authMiddleware)` call.

## Security controls

The backend currently applies these HTTP security measures:

- `cors` with credentials support and environment-aware origin policy
- `helmet` for baseline security headers
- `express-rate-limit` on login and refresh endpoints
- `cookie-parser` for HttpOnly cookie handling

Current environment policy:

- development: allow any origin dynamically while supporting credentialed requests
- production: allow only origins listed in environment configuration

## Ownership Enforcement

All resource services enforce that the requesting user owns the resource.

The class `ForbiddenError` (`src/utils/errors.ts`) is thrown by the service when ownership does not match:

```ts
export class ForbiddenError extends Error {
  readonly statusCode = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}
```

Controllers catch `ForbiddenError` and return `HTTP 403`:

```ts
if (error instanceof ForbiddenError)
  return res.status(403).json({ error: error.message });
```

Two ownership patterns exist:

**Direct** — resources with a `user_id` column (months, expenses, categories, monthly incomes, recurring incomes, recurring expenses, installment groups, budget rules):

```ts
if (resource.getDataValue("user_id") !== requestingUserId)
  throw new ForbiddenError();
```

**Traversal** — resources without a direct `user_id` (subcategories, income taxes, budget allocations, expense items, expense adjustments):

```ts
const parent = await parentRepository.findById(resource.parent_id);
if (parent.getDataValue("user_id") !== requestingUserId)
  throw new ForbiddenError();
```

All service methods that operate on a single resource accept `requestingUserId: string` as a parameter. Controllers always pass `req.user!.id`.

## Environment variables

| variable                    | purpose                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------- |
| ACCESS_TOKEN_SECRET         | signing secret for the access JWT (required; `JWT_SECRET` remains legacy fallback only) |
| ACCESS_TOKEN_TTL_MINUTES    | access token lifetime in minutes (optional, defaults to 15)                             |
| REFRESH_TOKEN_TTL_DAYS      | refresh session lifetime in days (optional, defaults to 30)                             |
| ACCESS_TOKEN_COOKIE_NAME    | access token cookie name (optional, defaults to `fc_access_token`)                      |
| REFRESH_TOKEN_COOKIE_NAME   | refresh token cookie name (optional, defaults to `fc_refresh_token`)                    |
| COOKIE_DOMAIN               | optional cookie domain for deployed environments                                        |
| FRONTEND_ORIGIN             | single allowed frontend origin; usable as production allowlist input                    |
| CORS_ALLOWED_ORIGINS        | comma-separated allowed origins for production                                          |
| TRUST_PROXY                 | reverse proxy setting for Express/rate limiting                                         |
| AUTH_LOGIN_RATE_LIMIT_MAX   | max login attempts per rate-limit window (optional, defaults to 5)                      |
| AUTH_REFRESH_RATE_LIMIT_MAX | max refresh attempts per rate-limit window (optional, defaults to 20)                   |
| APP_NAME                    | logical service name used in structured logs and metrics labels                         |
| LOG_LEVEL                   | backend log level override (`silent`, `error`, `warn`, `info`, `debug`)                 |
| METRICS_ENABLED             | enables Prometheus metrics collection when not set to `false`                           |

## Operational observability baseline

The backend now includes a minimal operational layer for production readiness.

### Structured logging

- `src/utils/logger.ts` provides the shared Pino logger
- startup and operational failures log structured JSON events instead of raw `console.log`
- `src/middlewares/request-logger.middleware.ts` emits one completion log per request
- request logs include `requestId`, method, route, status code, and duration
- sensitive fields such as cookies, tokens, and password values are redacted before output

### Error handling

- `src/middlewares/error-handler.middleware.ts` is the centralized fallback for HTTP boundary failures
- middleware-originated failures such as auth and CORS errors are normalized before response
- unexpected errors return `HTTP 500` with `{ "error": "Internal server error" }`

### Operational endpoints

- `GET /api/v1/live` verifies process liveness
- `GET /api/v1/ready` verifies application readiness, including database connectivity
- `GET /api/v1/health` returns an aggregate operational summary
- `GET /api/v1/metrics` exposes Prometheus/OpenMetrics text metrics

The readiness flow is implemented in `src/services/operational.service.ts` and uses the configured Sequelize connection to validate database availability.

### Metrics

- `src/utils/metrics.ts` owns the Prometheus registry and default process metrics
- HTTP request count and duration are captured centrally in the request logging middleware

Operational documentation for logging, health checks, metrics, backup guidance, retention, and incident response lives in `docs/architecture/backend-operations.md`.

---

# Architectural Style

The backend now follows a **Clean Architecture inspired hybrid structure**.

Runtime direction:

Interfaces HTTP
↓
Application Use Cases
↓
Domain Entities / Domain Rules
↓
Repositories / Infrastructure
↓
Sequelize / PostgreSQL

The repository still contains legacy folders from the previous layered organization, but the official runtime entrypoint now flows through the explicit application layer.

Main architectural layers:

- interfaces
- application
- domain
- infrastructure

Application layer organization rule:

- each application action lives in its own file under `src/application/use-cases/<entity>/<action>.use-case.ts`
- new backend work must not aggregate multiple actions in `src/application/use-cases/<entity>.use-cases.ts`
- migrated use cases should orchestrate repositories and domain rules directly instead of depending on legacy `src/services`

---

# Backend Quality Gates

Backend changes must satisfy an executable quality gate.

Current baseline:

- backend build must pass
- backend automated tests must pass
- critical HTTP and domain flows are covered through integration tests
- CI must run backend build plus backend tests against PostgreSQL

Mandatory rule:

- every new backend feature
- every backend bug fix
- every backend behavior-changing refactor

must add or update automated backend tests for the affected behavior.

For migrated application slices, prefer unit tests under `tests/unit/application/use-cases` in addition to any affected integration coverage.

Changes without automated coverage for the affected backend behavior are incomplete.

---

# Request Flow

Typical request lifecycle:

HTTP Request
↓
Interface Controller
↓
Application Use Case
↓
Domain Entities / Rules
↓
Repository
↓
Database (Sequelize / PostgreSQL)

Response:

Database
↓
Repository
↓
Application Use Case
↓
Interface Controller
↓
HTTP Response

---

# Folder Structure

The backend project now uses this architectural structure:

src/

application
domain
interfaces
repositories
models
middlewares
config
database
utils

Example:

src/
├ application
│ └ use-cases
│ └ expense.use-cases.ts
│
├ domain
│ ├ entities
│ │ └ budget-allocation.entity.ts
│ └ value-objects
│ └ month-period.ts
│
├ interfaces
│ └ http
│ ├ controllers
│ │ └ expense.controller.ts
│ └ routes
│ └ index.ts
│
├ repositories
│ └ expense.repository.ts
│
├ models
│ ├ expense.model.ts
│ └ auth-session.model.ts
│
├ middlewares
│ ├ auth.middleware.ts
│ └ rate-limit.middleware.ts
│
├ config
│ ├ auth.config.ts
│ └ security.config.ts
│
├ database
│ ├ connection.ts
│ └ migrations
│ └ 20260430000034-create-auth-sessions.js
│
└ utils
├ auth-cookies.ts
└ request-context.ts

## Current compatibility note

The repository still contains legacy `src/controllers`, `src/routes`, and `src/services` modules.

Current state:

- runtime controllers are exposed through `src/interfaces/http/controllers`
- runtime route composition starts in `src/interfaces/http/routes/index.ts`
- pure controller actions now live in resource folders such as `src/interfaces/http/controllers/category/create.controller.ts`
- Express adaptation is centralized in `src/interfaces/http/express-route.adapter.ts`
- `src/services` remains as a compatibility support layer reused by the explicit use cases while the domain/application split matures further

This is intentional and avoids a destructive rewrite while moving the runtime flow to the new architectural boundary.

## Test taxonomy

Backend automated tests are now organized by level:

- `backend/tests/unit` for pure domain or utility tests
- `backend/tests/integration/http` for Express + Supertest + PostgreSQL integration tests
- `backend/tests/shared` for reusable helpers

---

# Controllers

Controllers are responsible for:

- one action per file
- receiving simple request models instead of Express objects
- calling use cases
- returning simple HTTP response models

Controllers must **NOT**:

- implement business logic
- access the database directly
- interact with Sequelize models
- import `Request`, `Response`, or `NextFunction` from Express

Express-specific request extraction, cookie handling, fallback status normalization, and response serialization belong to the HTTP adapter layer.

Current adapter baseline:

- `src/interfaces/http/express-route.adapter.ts` maps Express requests into controller request models
- the adapter forwards failures to the centralized `error-handler` middleware
- action-specific fallback status normalization may occur in the adapter to preserve legacy HTTP contracts while services migrate to typed errors

Example responsibility:

Request parsing
Validation
Calling service
Formatting response

Example pattern:

```ts
export async function createExpenseController(request) {
  const result = await createExpenseUseCase.execute({
    ...request.body,
    user_id: request.userId,
  });

  return {
    statusCode: 201,
    body: result,
  };
}
```

Express adapter example:

```ts
router.post(
  "/",
  adaptExpressRoute(createExpenseController, (req) =>
    buildAuthenticatedHttpRequest(req),
  ),
);
```

Services

Services implement the business logic of the application.

Responsibilities:

business rules

validations

orchestration between repositories

Services must NOT:

access Express request or response objects

perform direct HTTP operations

Example:

ExpenseService
MonthlyIncomeService
BudgetService
BudgetService

Example pattern:

async createExpense(data: CreateExpenseDTO) {

const expense = await expenseRepository.create(data)

return expense
}
Repositories

Repositories handle database access.

They interact with Sequelize models.

Responsibilities:

database queries

persistence

query optimization

Repositories must NOT:

implement business logic

handle HTTP requests

Example responsibilities:

createExpense
findExpensesByMonth
findExpensesByCategory

Example pattern:

async create(data) {
return ExpenseModel.create(data)
}
Models

Models define Sequelize entities.

Each model represents a database table.

Example:

User
Expense
MonthlyIncome
Category

Example model:

export const Expense = sequelize.define('Expense', {

id: {
type: DataTypes.UUID,
primaryKey: true
},

value: {
type: DataTypes.DECIMAL
}

})

Models must define:

columns

data types

associations

DTOs (Data Transfer Objects)

DTOs define the structure of request data.

Purpose:

validation

input typing

API contracts

Example:

CreateExpenseDTO
CreateIncomeDTO
CreateBudgetRuleDTO

Example:

export interface CreateExpenseDTO {

userId: string
monthId: string
categoryId: string
value: number
description?: string

}
Routes

Routes connect HTTP endpoints to controllers.

Example:

POST /expenses
GET /expenses
GET /expenses/month/:monthId

Example route file:

router.post(
"/expenses",
expenseController.createExpense
)
Database Layer

Database interaction uses Sequelize.

Connection configuration lives in:

src/database/connection.ts

Migrations are stored in:

src/database/migrations

Sequelize models must match the schema defined in:

docs/architecture/database-model.md
Error Handling

The backend should implement centralized error handling.

Example middleware:

errorHandler

Responsibilities:

catch unexpected errors

return standardized responses

Example response:

{
"error": "ValidationError",
"message": "Invalid expense value"
}
Authentication (Future)

Authentication may include:

JWT tokens
login endpoints
user sessions

Auth middleware:

authMiddleware
Logging

The backend should include logging for:

requests
errors
database failures

Possible tools:

pino
winston
AI Guardrails

AI tools interacting with this repository must follow these rules:

1️⃣ Controllers must not access Sequelize models directly

2️⃣ Business logic must be implemented inside services

3️⃣ Database access must go through repositories

4️⃣ Models must reflect the schema defined in:

docs/architecture/database-model.md

5️⃣ Do not introduce new architectural layers unless explicitly defined

Summary

Architecture layers:

Controller
Service
Repository
Model
DTO

Technology stack:

Node.js
TypeScript
Express
Sequelize
PostgreSQL

Design principles:

Separation of concerns
Layered architecture
Explicit domain modeling
AI-friendly documentation

---

## Padrão de Model Sequelize

Todos os models Sequelize devem seguir o padrão de classe, conforme implementado em `budget-allocation.model.ts` e `category.model.ts`.

### Estrutura obrigatória

```ts
type XxxAttributes = XxxEntityInterface & { fkId?: string };
type XxxCreationAttributes = Omit<XxxAttributes, "id" | "methodNames">;

export class XxxModel
  extends Model<XxxAttributes, XxxCreationAttributes>
  implements XxxAttributes
{
  // fields declarados com !
  id!: string;
  fkId?: string;
  association!: AssocType; // VIRTUAL

  constructor(data?: XxxCreationAttributes, options?: BuildOptions) {
    super(data, options);
    // resolve FK a partir de nested object ou ID direto
    this.fkId = data?.fkId ?? data?.association?.id;
  }

  toDomain(): XxxEntity {
    const { fkId, ...rest } = this.get();
    return new XxxEntityImpl({
      ...rest,
      association: new AssocEntity({ id: fkId }),
    });
  }

  // delega métodos da interface via toDomain()
  methodFromInterface() {
    return this.toDomain().methodFromInterface();
  }
}

XxxModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fkId: { type: DataTypes.UUID, allowNull: false },
    association: {
      type: DataTypes.VIRTUAL,
      get() {
        return new AssocEntity({ id: this.getDataValue("fkId") });
      },
    },
    methodFromInterface: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.methodFromInterface;
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "table_name", underscored: true, timestamps: true },
);
```

### Regras

- **Nunca usar `sequelize.define(...)`**. Sempre `class XxxModel extends Model`.
- **`toDomain()`** é obrigatório em todo model. Retorna uma instância da entity, não um objeto literal.
- **FKs** são campos reais (`fkId: DataTypes.UUID`). O objeto de domínio associado é exposto via campo `VIRTUAL`.
- **Conflitos de nome**: quando o campo na entity tem o mesmo nome que o FK mas tipos diferentes (ex: `paidBy?: User` e coluna `paid_by`), usar `paidById` com `field: 'paid_by'` e um VIRTUAL `paidBy`.
- **Métodos da interface**: delegados via `toDomain()` e também declarados como `VIRTUAL` no `init()`.
- **Referências**: `budget-allocation.model.ts` e `category.model.ts`.

---

## Padrão de Repository

### Visão Geral

Todo repositório segue a separação em três camadas:

1. **Interface de domínio** — `backend/src/domain/repositories/xxx.repository.ts`
2. **Implementação** — `backend/src/repositories/xxx.repository.ts`
3. **Uso nos use-cases** — construtores tipados com a interface, instanciados com a implementação concreta como default

### Interface de Domínio

Fica em `domain/repositories/` e define o contrato usando tipos de domínio (entities), nunca tipos Sequelize:

```typescript
// domain/repositories/subcategory.repository.ts
import { Subcategory } from "../entities/subcategory.entity";
import { Category } from "../entities/category.entity";

export interface ISubcategoryRepository {
  create(
    data: Omit<Subcategory, "id" | "createdAt" | "updatedAt">,
  ): Promise<Subcategory>;
  findById(id: string): Promise<Subcategory | null>;
  findByCategoryId(categoryId: string): Promise<Subcategory[]>;
  update(
    id: string,
    data: Partial<Pick<Subcategory, "name">>,
  ): Promise<Subcategory | null>;
  delete(subcategory: Subcategory): Promise<void>;
}
```

### Implementação

Fica em `repositories/` e importa o model diretamente do arquivo (nunca de `models/index.ts`). Implementa a interface declarada no domínio:

```typescript
// repositories/subcategory.repository.ts
import { SubcategoryModel } from "../models/subcategory.model";
import type { ISubcategoryRepository } from "../domain/repositories/subcategory.repository";
import type { Subcategory } from "../domain/entities/subcategory.entity";

export class SubcategoryRepository implements ISubcategoryRepository {
  async create(
    data: Omit<Subcategory, "id" | "createdAt" | "updatedAt">,
  ): Promise<Subcategory> {
    const record = await SubcategoryModel.create({
      categoryId: data.category.id,
      name: data.name,
    });
    return record.toDomain();
  }
  // ...demais métodos
}
```

### Convenções de Mapeamento

- **Parâmetros**: use-cases passam objetos de domínio completos (ex: `category: Category`). O repositório extrai os IDs necessários (ex: `categoryId: data.category.id`).
- **camelCase**: Sequelize com `underscored: true` armazena snake_case no banco, mas todos os campos no TypeScript são camelCase. Nunca usar `getDataValue("snake_case_field")` nos use-cases.
- **toDomain()**: todo resultado de query deve passar por `model.toDomain()` antes de ser retornado. Nunca retornar instâncias Sequelize fora dos repositórios.
- **delete entity-based**: o método `delete` recebe a entity (não o ID), garantindo que o use-case já tenha verificado a existência antes de deletar.
- **FKs compostos**: quando o model tem FK com nome diferente do campo da entity (ex: `installmentGroupFkId` ≠ `installmentGroupId`), as queries WHERE devem usar o nome do campo no model.

### Uso nos Use-Cases

```typescript
// application/use-cases/subcategory/create.use-case.ts
import type { ISubcategoryRepository } from "../../../domain/repositories/subcategory.repository";
import { SubcategoryRepository } from "../../../repositories/subcategory.repository";

export class CreateSubcategoryUseCase {
  constructor(private readonly subcategoryRepository: ISubcategoryRepository) {}
}
```

O tipo do construtor é a **interface**. O default é a **implementação concreta**. Isso permite injeção de mocks nos testes unitários sem framework de DI.

---

## Padrão de Controller (Camada HTTP)

### Responsabilidades

Controllers implementam `IController<TRequest, TResponse>` e são responsáveis por:

1. **Validar entrada** com `class-validator` antes de chamar o use-case
2. **Extrair userId do JWT** via `request.userId` — nunca do body da requisição
3. **Chamar o use-case** com assinatura escalar `(id, data, userId)`
4. **Converter a resposta** para snake_case antes de retornar

### Assinatura de Use-Cases

Use-cases recebem parâmetros escalares, não entidades de domínio:

```typescript
// ✅ Correto — escalares
async execute(id: string, data: { name?: string; type?: CategoryType }, userId: string): Promise<Category>

// ❌ Errado — entidades como parâmetro de entrada
async execute(category: Category, requestingUser: User): Promise<Category>
```

### Validação com class-validator

Controllers usam `class-validator` + `class-transformer` para validar o corpo da requisição antes de chamar o use-case:

```typescript
class CreateCategoryBody {
  @IsString()
  @MinLength(2, { message: "Category name must be between 2 and 100 characters" })
  @MaxLength(100, { message: "Category name must be between 2 and 100 characters" })
  name: string;

  @IsEnum(CategoryType, { message: "Invalid category type" })
  type: CategoryType;
}

async handle(request) {
  const body = plainToInstance(CreateCategoryBody, request.body);
  const errors = await validate(body);
  if (errors.length > 0) {
    const message = Object.values(errors[0].constraints ?? {})[0];
    throw new BadRequestError(message);
  }
  // ...
}
```

### Conversão snake_case ↔ camelCase (Estratégia: controller-level)

A conversão é feita **no controller**, não no adapter, middleware ou use-case. Cada controller converte explicitamente a resposta para snake_case:

```typescript
// ✅ Resposta sempre snake_case
return {
  statusCode: 200,
  body: {
    id: result.id,
    name: result.name,
    type: result.type,
    user_id: result.user.id,
    created_at: result.createdAt,
    updated_at: result.updatedAt,
  },
};
```

**Justificativa**: converter no adapter quebraria todos os flows existentes de uma vez. Converter no controller é explícito, isolado e progressivo.

### userId vem sempre do JWT

```typescript
// ✅ userId do token autenticado
const result = await this.useCase.execute(
  request.params.id,
  body,
  request.userId,
);

// ❌ userId nunca vem do body
const { user_id } = request.body; // PROIBIDO para autorização
```

---

## Padrão de Composer (Injeção de Dependência)

Cada flow tem um arquivo `index.ts` na pasta do controller que instancia e conecta todos os objetos:

```typescript
// src/interfaces/http/controllers/category/index.ts
const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();

export const categoryComposer = {
  create: new CreateCategoryController(
    new CreateCategoryUseCase(categoryRepository, userRepository),
  ),
  // ...
};
```

O router importa apenas o composer — sem DI inline:

```typescript
// routes/category.routes.ts
import { categoryComposer } from "../interfaces/http/controllers/category";

router.post(
  "/",
  adaptExpressRoute(
    categoryComposer.create.handle.bind(categoryComposer.create),
    (req) => buildAuthenticatedHttpRequest(req),
  ),
);
```

---

## Regras de Teste de Controller

- **Unitários**: cada controller tem um arquivo de teste em `tests/unit/interfaces/http/controllers/{flow}/`
- Controllers são testados com mocks do use-case (sem DB, sem HTTP real)
- Verificar: status code, shape snake_case da resposta, propagação de erros do use-case
- Verificar: `BadRequestError` para inputs inválidos (class-validator)

```typescript
it("returns 201 with snake_case response on success", async () => {
  const useCase = { execute: vi.fn().mockResolvedValue(category) };
  const controller = new CreateCategoryController(useCase as any);
  const response = await controller.handle(
    makeAuthRequest({ body: { name: "Essentials", type: "necessary" } }) as any,
  );
  expect(response.statusCode).toBe(201);
  expect(response.body).toMatchObject({ user_id: category.user.id });
});
```
