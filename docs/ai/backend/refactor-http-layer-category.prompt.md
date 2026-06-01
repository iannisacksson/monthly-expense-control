# Prompt: Refatoração da Camada HTTP — Category (Referência de Padrão)

## Objetivo

Esta tarefa refatora o flow completo de **category** para estabelecer o padrão definitivo de implementação da camada HTTP do projeto:

- Conversão snake_case ↔ camelCase entre HTTP e domínio
- Validação de entrada com `class-validator` na controller
- Composite pattern para injeção de dependências
- Assinaturas de use-case padronizadas (`id`, `data`, `userId`)
- Documentação de regras obrigatórias

O flow de category será a **implementação de referência**. Outros flows serão migrados depois.

---

## Pré-condições obrigatórias antes de qualquer implementação

### 1. Leia os seguintes documentos na ordem abaixo

```
docs/ai/backend-coding-rules.md
docs/architecture/backend-architecture.md
docs/architecture/api-spec.md
docs/domain/domain-model.md
docs/architecture/dto-spec.md
```

### 2. Inspecione os arquivos de referência já implementados

```
backend/src/interfaces/http/controllers/category/update.controller.ts   ← referência iniciada pelo desenvolvedor
backend/src/interfaces/http/express-route.adapter.ts
backend/src/interfaces/http/http.types.ts
backend/src/routes/category.routes.ts
backend/src/application/use-cases/category/update.use-case.ts
```

### 3. Inspecione os testes existentes

```
backend/tests/unit/application/use-cases/category/category.use-cases.unit.test.ts
backend/tests/integration/http/category.integration.test.ts
```

### 4. Defina a todo list completa antes de iniciar

Após ler toda a documentação e o código, defina explicitamente cada item da todo list com descrição clara. Faça um review da lista antes de começar qualquer implementação.

### 5. Tire as dúvidas antes de implementar

Se qualquer requisito abaixo estiver ambíguo após a leitura da documentação e do código, **pare e pergunte**. Nunca deduza. Nunca inicie a implementação com informações ambíguas.

---

## Contexto de estado atual

### O que já existe

O desenvolvedor iniciou a refatoração no `update.controller.ts` de category como referência do padrão desejado. Esse arquivo mostra:

- A controller recebe a use-case via construtor (DI explícita, sem default)
- O request type `UpdateCategoryRequest` mapeia campos snake_case vindos do HTTP
- A response type `UpdateCategoryResponse` retorna campos snake_case
- A controller monta `CategoryEntity` e `UserEntity` internamente

### O que ainda não existe

- Conversão sistemática snake_case → camelCase na entrada (está manual no controller)
- Validação de tipos com `class-validator` (a lib não está instalada)
- Composite pattern para DI (as dependências são instanciadas diretamente no router)
- Assinatura padronizada do `UpdateCategoryUseCase` (`id`, `data`, `userId`) — o teste unitário já espera a nova assinatura mas a use-case ainda tem a assinatura antiga
- Documentação das regras

### Inconsistência conhecida

O teste unitário de category já chama `useCase.execute("category-1", { name: "Housing" }, "user-1")`, mas a use-case atual ainda tem a assinatura `execute(category: Category, requestingUser: User)`. Isso é parte desta refatoração.

---

## Requisitos detalhados

### Requisito 1 — Assinatura padronizada das use-cases de category

Todas as use-cases de category devem ter assinatura `(id, data, userId)` ou `(id, userId)` — sem receber entities diretamente como parâmetro. A construção das entities é responsabilidade interna da use-case.

Referência: o teste unitário já foi atualizado com as assinaturas esperadas. A use-case deve ser alinhada ao teste.

**Arquivos afetados:**
- `backend/src/application/use-cases/category/update.use-case.ts`
- Os outros use-cases de category podem já estar corretos — verifique antes de alterar.

---

### Requisito 2 — Conversão snake_case ↔ camelCase

**Contexto para análise de trade-offs:**

O projeto usa `underscored: true` no Sequelize, então o banco persiste em snake_case. O domínio usa camelCase. A API expõe snake_case para o cliente (convenção REST do projeto, ver `api-spec.md`).

Há três lugares possíveis para realizar a conversão:

| Opção | Local | Vantagens | Desvantagens |
|-------|-------|-----------|--------------|
| A | Adapter (`express-route.adapter.ts`) | Centralizado, automático | Todos os flows mudam ao mesmo tempo; difícil escapar por exceção; pode quebrar flows que já funcionam |
| B | Controller | Explícito, por flow, controlável; sem impacto nos demais flows | Repetitivo se feito manualmente em muitos controllers |
| C | Middleware Express por rota | Granular; fácil de habilitar por router | Adiciona complexidade extra; o body pode ser transformado invisível |

**Decisão a documentar e implementar:**

Analisar os três, registrar a decisão arquitetural com justificativa clara, e implementar para o flow de category. A decisão não deve quebrar nenhum outro flow existente.

**Regras obrigatórias independente da opção escolhida:**

- Entrada HTTP: campos snake_case → domínio camelCase (ex: `category_id` → `categoryId`, `user_id` → `userId`)
- Saída HTTP: domínio camelCase → resposta snake_case (ex: `createdAt` → `created_at`, `updatedAt` → `updated_at`)
- `userId` nunca vem do body — sempre do token JWT via `req.user.id`

---

### Requisito 3 — Validação com `class-validator` nas controllers de category

Instalar `class-validator` e `class-transformer`. Aplicar apenas nas controllers de category.

**Regras:**

- Criar classes de request tipadas com decorators `@IsString()`, `@IsOptional()`, `@IsEnum()`, `@IsNotEmpty()` etc. conforme o tipo de cada campo
- A validação deve ocorrer dentro do método `handle()` da controller, antes de chamar a use-case
- Erros de validação devem retornar HTTP 400 com mensagem legível
- Não usar `class-validator` fora das controllers de category nesta tarefa

**Campos de referência (ver `api-spec.md` e `category.dto.ts` para tipos exatos):**

- `CreateCategoryRequest`: `name` (string obrigatório), `type` (enum obrigatório)
- `UpdateCategoryRequest`: `name` (string opcional), `type` (enum opcional) — pelo menos um deve estar presente
- `GetCategoryByIdRequest`: apenas param `id` (string UUID obrigatório)
- `DeleteCategoryRequest`: apenas param `id` (string UUID obrigatório)
- `ListCategoriesByUserRequest`: apenas param `userId` (string UUID obrigatório)

---

### Requisito 4 — Composite pattern para injeção de dependências

**Problema atual:** As dependências de category são instanciadas diretamente em `category.routes.ts`, misturando responsabilidade de roteamento com responsabilidade de composição.

**O que deve ser criado:**

Um arquivo `backend/src/interfaces/http/controllers/category/index.ts` (ou `category.composer.ts`) que:

- Instancia as dependências na ordem correta (repositórios → use-cases → controllers)
- Exporta apenas os controllers prontos para uso no router
- Não exporta repositórios ou use-cases para fora do composer

**O router `category.routes.ts` deve:**

- Importar apenas os controllers compostos
- Conter apenas a lógica de roteamento Express (path, método HTTP, adapter, mapRequest)
- Não instanciar nenhuma dependência

**Exemplo esperado do router após refatoração:**

```typescript
import { categoryControllers } from "../interfaces/http/controllers/category";
import { adaptExpressRoute, buildAuthenticatedHttpRequest } from "../interfaces/http/express-route.adapter";

router.put("/:id", adaptExpressRoute(
  categoryControllers.update.handle.bind(categoryControllers.update),
  (req) => buildAuthenticatedHttpRequest(req),
));
```

---

### Requisito 5 — Testes unitários de category

**Verificar e corrigir o teste unitário existente:**

- Conferir se `category.use-cases.unit.test.ts` cobre todos os use-cases com as novas assinaturas
- Adicionar testes para as controllers de category, cobrindo:
  - Conversão snake_case → camelCase na entrada
  - Conversão camelCase → snake_case na saída
  - Erros de validação (`class-validator`) retornando 400
  - DI via construtor (mock da use-case)

**Local dos novos testes de controller:**

```
backend/tests/unit/application/use-cases/category/   ← use-case tests (já existe)
backend/tests/unit/interfaces/http/controllers/category/  ← controller tests (criar)
```

---

### Requisito 6 — Testes de integração de category

Atualizar `backend/tests/integration/http/category.integration.test.ts` para cobrir:

- Criação com payload snake_case válido e verificação da resposta snake_case
- Atualização com payload snake_case válido
- Validação de entrada inválida retornando 400 com mensagem de erro do `class-validator`
- Acesso proibido (403) de outro usuário
- Recurso não encontrado (404)

---

### Requisito 7 — Regra de execução de testes

Ao final desta tarefa, e como regra permanente a ser documentada:

**Ao final de qualquer feature, bugfix, hotfix ou refatoração, os testes unitários devem ser executados:**

```bash
cd backend && npx vitest run --config vitest.unit.config.ts tests/unit
```

Se algum teste falhar, a correção faz parte da mesma tarefa. A entrega nunca está completa com testes quebrando.

---

### Requisito 8 — Atualização de documentação

Atualizar `docs/architecture/backend-architecture.md` adicionando seções para:

**8.1 — Padrão de Controller**

Documentar:
- A controller implementa `IController<TRequest, TResponse>`
- Recebe a use-case via construtor (sem default — DI obrigatória)
- Valida a entrada com `class-validator` antes de chamar a use-case
- Converte snake_case → camelCase na entrada (explicar onde e como)
- Converte camelCase → snake_case na saída
- `userId` nunca vem do body

**8.2 — Padrão de Router**

Documentar:
- O router contém apenas: path, método HTTP, adapter, mapRequest
- Não instancia dependências
- Importa controllers compostos do composer

**8.3 — Composite Pattern (Composer)**

Documentar:
- Um arquivo `index.ts` ou `composer.ts` por domínio em `interfaces/http/controllers/<domain>/`
- Instancia repositórios → use-cases → controllers
- Exporta apenas os controllers

**8.4 — Conversão snake_case ↔ camelCase**

Documentar a decisão arquitetural tomada (qual opção A/B/C foi escolhida), a justificativa, e como aplicar em novos flows.

**8.5 — Regra de testes obrigatórios**

Documentar:
- Os testes unitários devem ser executados ao final de qualquer feature, bugfix, hotfix ou refatoração
- Testes com falha devem ser corrigidos antes de considerar a tarefa concluída
- Comando de referência: `npx vitest run --config vitest.unit.config.ts tests/unit`

Atualizar também `docs/ai/backend-coding-rules.md` com as mesmas regras de controller, router, composer e testes.

---

## Restrições

- **Não refatorar outros flows** (user, month, expense etc.) nesta tarefa. As regras documentadas serão o guia para migrações futuras.
- **Não alterar** `express-route.adapter.ts` de forma que quebre outros flows existentes. Se a opção A (adapter) for escolhida, a mudança deve ser opt-in (configurável por rota) ou retrocompatível.
- **Não instalar bibliotecas adicionais** além de `class-validator` e `class-transformer` sem perguntar primeiro.
- **Não modificar** o banco de dados, migrations ou models nesta tarefa.
- **Não modificar** os outros use-cases fora de category, exceto se a mudança for estritamente necessária para a compilação TypeScript.

---

## Ordem de implementação sugerida

> Adapte conforme necessário após a leitura da documentação e do código.

1. Definir todo list e fazer review
2. Tirar dúvidas se houver
3. Instalar `class-validator` e `class-transformer`
4. Corrigir assinatura do `UpdateCategoryUseCase` para alinhar ao teste unitário
5. Decidir e documentar a estratégia de conversão snake_case ↔ camelCase (Req. 2)
6. Refatorar as 5 controllers de category (validação + conversão + DI via construtor)
7. Criar o composer de category
8. Refatorar o router de category
9. Atualizar os testes unitários (use-cases + controllers)
10. Atualizar os testes de integração de category
11. Executar `npx vitest run --config vitest.unit.config.ts tests/unit` e corrigir falhas
12. Atualizar `docs/architecture/backend-architecture.md`
13. Atualizar `docs/ai/backend-coding-rules.md`

---

## Critérios de aceite

- [ ] `UpdateCategoryUseCase.execute(id, data, userId)` alinhado com o teste unitário existente
- [ ] Todas as 5 controllers de category têm validação com `class-validator`
- [ ] Entrada HTTP em snake_case é convertida para camelCase antes de chegar na use-case
- [ ] Saída da controller é snake_case
- [ ] O router de category não instancia nenhuma dependência
- [ ] O composer de category existe e exporta controllers compostos
- [ ] Testes unitários de use-cases passando
- [ ] Testes unitários de controllers de category criados e passando
- [ ] Testes de integração de category passando
- [ ] `npx vitest run --config vitest.unit.config.ts tests/unit` — zero falhas
- [ ] `backend-architecture.md` atualizado com as 5 seções documentadas
- [ ] `backend-coding-rules.md` atualizado com regras de controller, router, composer e testes
- [ ] Nenhum outro flow foi quebrado
