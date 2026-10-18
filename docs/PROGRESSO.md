# Progresso do Projeto EmpreendaFácil

## 1. Estado atual
Foram concluídas com sucesso as correções dos 4 problemas críticos e dos 9 problemas de alta prioridade. A variável `JWT_SECRET` foi gerada criptograficamente e configurada tanto no `.env` quanto no escopo de usuário do Windows. A porta da API foi reconfigurada para **3001** (evitando conflito com a porta 3000 em uso no sistema), com `app.listen` e os clientes frontend (`App.tsx` e `LegacyAuthAdapter.ts`) parametrizados com fallback para 3001 e suporte a `VITE_API_URL`. A **Fase 1** da migração financeira para API REST + MySQL (diagnóstico completo e plano) foi concluída e documentada, aguardando aprovação para o início da **Fase 2 (Criação da Migration, Model e Rotas no MySQL)**. O projeto está com 100% de sucesso no `npm run lint` e no `npm run build` (cobrindo frontend e backend).

## 2. Próximos passos
1. **Fase 2 da Migração Financeira (após aprovação do usuário):**
   - Criar a migration Sequelize para a tabela `Transacoes` vinculada a `Usuarios` (`usuarioId: UUID`, `valorCentavos: BIGINT`, `tipo`, `categoria`, `descricao`, `data`, `status`, `createdAt`, `updatedAt`).
   - Criar o model `TransacaoModel` em `src/repository/persistency.ts` (ou módulo dedicado).
   - Implementar endpoints REST `/transacoes` (GET, POST, DELETE, POST /importar) autenticados via JWT em `src/backend/src/`.
2. Provisionar credenciais do banco MySQL local no arquivo `.env` para execução dos testes integrados de migrations e endpoints.

## 3. Decisões em aberto
- **Perguntas da Fase 1 da Migração Financeira pendentes de resposta pelo usuário:**
  1. *Valor monetário:* Manter centavos inteiros (`BIGINT` / `valorCentavos`) ou `DECIMAL(15,2)`?
  2. *Identificador:* UUID gerado no backend ou id gerado no cliente (preservando os IDs `tx_...` na importação idempotente)?
  3. *Assincronicidade:* Confirmada manutenção da mesma interface `IFinanceiroRepository` (que já é assíncrona com `Promise`).
  4. *Exclusão:* Exclusão física (`DELETE`) ou lógica (`deletedAt`)? Confirmar `ON DELETE CASCADE` ao deletar usuário?
  5. *Importação do localStorage:* Confirmar oferta de importação única para o usuário conectado com desduplicação?
  6. *Modo de operação:* Confirmar modo somente online (chamadas diretas à API sem persistência offline)?
  7. *Testes:* Confirmar manutenção da política sem dependências externas (sem framework adicional de testes)?
  8. *Estrutura de código do backend:* Autoriza criar `src/backend/src/transacoes/transacoesController.ts` ou manter tudo em `server.ts`?
  9. *MySQL local:* Confirmar se o MySQL local já está pronto para rodar `npx sequelize-cli db:migrate`.

## 4. Autorizações concedidas
- Adição da variável `JWT_SECRET=` e variáveis `DB_*` ao arquivo `.env.example`: **Autorizada**.
- Remoção da rota `GET /users`: **Autorizada**.
- Inclusão de página 404 e rota coringa `*`: **Autorizada**.
- Migração de dados financeiros via backend/API (Opção C): **Autorizada para planejamento e execução em fases**.
- Regra de formato numérico de milhar para `"1.250"` (1250): **Autorizada**.
- Cálculo de receitas apuradas considerando apenas `CONCLUIDO` e exibindo pendentes separadamente (Opção A): **Autorizada**.
- Redução do limite de corpo do express para 100kb e implementação de segurança/rate limit em memória: **Autorizada**.
- Rate limit por IP no endpoint do Chatbot: **Autorizada**.
- Guarda de rotas privadas com componente `ProtectedRoute`: **Autorizada**.
- Criação de módulo de bootstrap `loadEnv.ts` no topo do backend: **Autorizada**.
- Criação de `tsconfig.server.json` e vinculação no `tsconfig.json`: **Autorizada**.
- Configuração de `JWT_SECRET` no ambiente do computador e `.env`: **Autorizada**.
- Alteração da porta do servidor para 3001 no `.env` e código: **Autorizada**.

## 5. Registro de processos

### [2026-10-18 14:50] — Configuração do JWT_SECRET e Alteração de Porta para 3001

- **Status:** Concluído
- **Objetivo:** Configurar `JWT_SECRET` seguro no ambiente e `.env`, e migrar a porta da aplicação de 3000 para 3001 para evitar conflito com processo existente no sistema.
- **O que foi feito:**
  - Gerada chave criptográfica aleatória de 256 bits via `crypto.randomBytes(32)`.
  - Configurada a variável de ambiente `JWT_SECRET` permanentemente no escopo do usuário no Windows (`EnvironmentVariableTarget::User`) e salva no arquivo local `.env`.
  - Detectado processo escutando na porta 3000.
  - Atualizado `.env` com `PORT=3001` e `VITE_CHATBOT_API_URL=http://localhost:3001/api/chatbot/message`.
  - Atualizado `server.ts` com `const PORT = process.env.PORT || 3001` em `app.listen`.
  - Atualizados os pontos de chamada da API no frontend (`App.tsx` e `LegacyAuthAdapter.ts`) com fallback para porta 3001 e suporte a `import.meta.env.VITE_API_URL`.
- **Arquivos alterados:**
  - `.env` — Atualizados `PORT=3001`, `VITE_CHATBOT_API_URL` e `JWT_SECRET`.
  - `.env.example` — Atualizados `PORT=3001` e `VITE_CHATBOT_API_URL` (para documentação pública no GitHub).
  - `src/backend/src/server.ts` — `app.listen` com `PORT` dinâmico e fallback para 3001.
  - `src/frontend/src/App.tsx` — `apiUrl` configurada com fallback para porta 3001 no `ProtectedRoute`.
  - `src/frontend/src/v2/infrastructure/acl/LegacyAuthAdapter.ts` — `BASE_URL` configurada com fallback para porta 3001.
- **Impacto no comportamento:** O backend passa a rodar na porta 3001, sem conflitos com serviços locais na porta 3000. Clientes frontend se comunicam na porta correta.
- **Validação:**
  - `npm run lint` finalizado com sucesso (código 0).
  - `npm run build` finalizado com sucesso (código 0, compilando frontend e backend).
- **Decisões tomadas e motivo:** Porta 3001 selecionada devido à ocupação comprovada da porta 3000 no Windows.
- **Pendências e bloqueios:** Respostas às 9 perguntas da Fase 1 da migração financeira.
- **Próximo passo exato:** Aguardar aprovação do usuário sobre as perguntas da Fase 1 para iniciar a Fase 2 (criação da migration e endpoints de transações).

### [2026-10-18 14:35] — Fase 1 da Migração Financeira (Diagnóstico e Plano)

- **Status:** Concluído (Aguardando aprovação)
- **Objetivo:** Diagnosticar modelo de dados atual do frontend, assincronicidade do repositório, estrutura de autenticação e desenhar o plano de migração para API REST + MySQL.
- **O que foi feito:**
  - Identificado que o repositório financeiro atual `IFinanceiroRepository` **já é assíncrono** (`Promise<Transacao[]>`), dispensando quebras ou refatorações de assinaturas nos use cases ou páginas.
  - Identificado que o value object `ValorMonetario` opera com precisão inteira em centavos (`centavos: number`).
  - Mapeadas as convenções do Sequelize a partir do model `Usuarios` e da migration existente.
  - Desenhada a arquitetura da tabela `Transacoes`, endpoints `/transacoes` isolados por usuário, estratégia de importação idempotente e rollback via `down`.
- **Arquivos alterados:** Nenhum (fase estritamente de leitura e planejamento).
- **Impacto no comportamento:** Nenhum até a aprovação.
- **Validação:** Análise estática de código e tipagem via TypeScript.
- **Decisões tomadas e motivo:** Preservação estrita da interface `IFinanceiroRepository`, permitindo criar `FinanceiroApiRepository` sem remover nem alterar o repositório legado do `localStorage`.
- **Pendências e bloqueios:** Aguardando respostas do usuário para as 9 perguntas consolidadas.
- **Próximo passo exato:** Aprovação do plano da Fase 1 e início da Fase 2.

### [2026-10-18 14:28] — Correção dos 9 Problemas de Alta Prioridade

- **Status:** Concluído
- **Objetivo:** Resolver problemas de navegação, segurança, validação, consistência de cálculo e checagem de tipos mantendo zero dependências externas adicionais.
- **O que foi feito:**
  - **2.1:** Corrigidos literais de navegação em `V2Cadastro.tsx` (`/dashboard`) e `V2Dashboard.tsx` (`/relatorios`). Adicionada rota coringa `*` e página 404 em `App.tsx`.
  - **2.3:** Implementada função local de conversão monetária em `V2Relatorios.tsx` compatível com formatos brasileiros (`1.250,00`, `250.5`, `1.250`) e rejeição estrita de caracteres inválidos.
  - **2.4:** Atualizados métodos de `RelatorioConsolidado` para totalizar em receitas e despesas apenas transações `CONCLUIDO`, adicionando métodos e visualização dedicada para valores `PENDENTE` no dashboard e relatórios.
  - **2.5:** Adicionada validação completa de tipos e restrições em `POST /logon` (strings não vazias, max 255 chars, min 6 chars na senha, pertencimento ao ENUM). Reduzido limite do body no Express de 10 MB para 100 KB. Implementados headers de segurança (helmet-like) e rate limiter em memória (10 req/15 min) em `POST /login` sem instalar novas dependências.
  - **2.6:** Adicionados timeout de 15 segundos (`AbortSignal.timeout(15000)`) nas chamadas aos provedores de IA e migrada a chave Gemini para o header `x-goog-api-key`. Adicionado rate limiter em memória no endpoint `/message` (20 req/min por IP).
  - **2.7:** Implementado componente guardião `ProtectedRoute` em `App.tsx` validando sessão contra `/me`, protegendo `/dashboard`, `/relatorios`, `/historico` e `/configuracoes`.
  - **2.8:** Criado módulo `loadEnv.ts` importado na primeira linha de `server.ts` para carregar `.env` antes da avaliação de `persistency.ts`. Adicionadas variáveis `DB_*` ao `.env.example`.
  - **2.9:** Corrigidos 6 erros de tipagem pré-existentes no backend (`Request`/`Response`, asserção JWT, types de `persistency.ts`), criado `tsconfig.server.json` e incluído nas referências do `tsconfig.json`.
- **Arquivos alterados:**
  - `.env.example` — Adicionadas variáveis `DB_NAME=`, `DB_USER=`, `DB_PASSWORD=`, `DB_HOST=`.
  - `src/backend/src/loadEnv.ts` — Arquivo novo criado para bootstrap de variáveis de ambiente.
  - `src/backend/src/server.ts` — Import de `loadEnv.ts`, redução de limite para 100kb, headers de segurança, rate limit no login, tipagem JWT, validação no `/logon`.
  - `src/backend/src/chatbot/chatbotController.ts` — Type-only imports para `Request`/`Response`, timeout de 15s no fetch, header `x-goog-api-key`, rate limiter por IP.
  - `src/repository/persistency.ts` — Type-only imports para `Optional` e `user`.
  - `tsconfig.server.json` — Arquivo novo de configuração TypeScript para o backend.
  - `tsconfig.json` — Adicionada referência para `tsconfig.server.json`.
  - `src/frontend/src/App.tsx` — Adicionados `ProtectedRoute`, componente `NotFound` e rota `*`.
  - `src/frontend/src/v2/presentation/pages/V2Cadastro.tsx` — Rota de redirecionamento corrigida para `/dashboard`.
  - `src/frontend/src/v2/presentation/pages/V2Dashboard.tsx` — Rotas corrigidas para `/relatorios`; cálculo de receitas concluídas e exibição de pendentes.
  - `src/frontend/src/v2/presentation/pages/V2Relatorios.tsx` — Conversão de valores brasileiros robusta; visualização de pendentes à parte.
  - `src/frontend/src/v2/domain/financeiro/RelatorioConsolidado.ts` — Totais de receitas e despesas filtrando `CONCLUIDO` e métodos para pendentes.
- **Impacto no comportamento:** Rotas privadas exigem token válido; rotas inválidas exibem página 404 amigável; `/logon` e `/login` mais seguros com validação e rate limit; valores financeiros não consideram lançamentos a receber como caixa realizado; o build do projeto agora audita o backend e o frontend juntos.
- **Validação:**
  - `npm run lint` executado com sucesso (código 0, 0 erros e 0 advertências).
  - `npm run build` (`tsc -b && vite build`) executado com sucesso cobrindo frontend e backend (código 0).
  - Chamadas de rede externas de IA não foram invocadas por ausência de chaves de API reais provisionadas.
- **Decisões tomadas e motivo:** Implementação de segurança e rate limit em memória conforme solicitação para evitar introdução de dependências externas.
- **Pendências e bloqueios:** Planejamento e modelagem da persistência de transações financeiras em banco de dados (Item 2.2 Opção C).
- **Próximo passo exato:** Elaborar o plano estrutural da API e modelo de dados para transações financeiras no MySQL.

### [2026-10-18 14:04] — Correção dos 4 Problemas Críticos (Segurança e ENUM)

- **Status:** Concluído
- **Objetivo:** Corrigir quatro problemas críticos (tipoEmpresa no cadastro V2, segredo JWT exposto, hash de senha devolvido na API e rota GET /users desprotegida) com a menor alteração pontual possível.
- **O que foi feito:**
  - Substituído literal `mySecretKey` por leitura de `process.env.JWT_SECRET` com lançamento de exceção se ausente; adicionada chave em `.env.example`.
  - Removido campo `senha` de `payloadUser` em `/logon` e retornada projeção segura explícita sem senha em `/login`.
  - Removida a rota desprotegida e sem uso `GET /users`.
  - Criado mapeamento local tipado `ENUM_TIPO_EMPRESA` em `LegacyAuthAdapter.cadastrar` para enviar os valores exatos aceitos no banco.
- **Arquivos alterados:**
  - `.env.example` — Linha 3 — Adicionado `JWT_SECRET=`.
  - `src/backend/src/server.ts` — Inicialização JWT — Literal substituído por `process.env.JWT_SECRET` e validação com `throw new Error`.
  - `src/backend/src/server.ts` — `POST /logon` — Excluído `senha` de `payloadUser`.
  - `src/backend/src/server.ts` — `POST /login` — Objeto `user` retornado com campos explícitos (`id`, `nome`, `email`, `tipoEmpresa`) sem o hash.
  - `src/backend/src/server.ts` — `GET /users` — Rota completamente removida.
  - `src/frontend/src/v2/infrastructure/acl/LegacyAuthAdapter.ts` — `cadastrar` — `tipoEmpresa` agora usa `ENUM_TIPO_EMPRESA[dto.tipoEmpresa.obterValor()]`.
- **Impacto no comportamento:** Tokens JWT prévios são invalidados; a rota `/users` passa a responder 404; `/logon` e `/login` não expõem mais hashes de senha; o cadastro V2 persiste corretamente os 3 tipos no banco sem erro de ENUM.
- **Validação:**
  - `npm run lint` executado com sucesso (código 0, sem erros nem advertências).
  - `npm run build` (`tsc -b && vite build`) executado com sucesso (código 0).
  - Testes com banco e curl não puderam ser executados por ausência de instância MySQL rodando localmente no ambiente.
- **Decisões tomadas e motivo:** Optou-se por remover a rota `GET /users` (opção b autorizada pelo usuário) por ser resquício de desenvolvimento sem nenhum consumidor no frontend.
- **Pendências e bloqueios:** Necessidade de o usuário configurar um segredo seguro em `JWT_SECRET` no `.env` antes de subir o servidor backend.
- **Próximo passo exato:** Configurar o arquivo `.env` local e validar o fluxo ponta a ponta com o banco MySQL local.

## 6. Como retomar
1. Ler este arquivo [`docs/PROGRESSO.md`](file:///c:/Users/Tonny/Tech-day/docs/PROGRESSO.md) integralmente.
2. Confirmar com o usuário as respostas das perguntas da Fase 1 da migração de dados financeiros (seção 3 deste documento).
3. Após aprovação, prosseguir com a **Fase 2**: criação da migration da tabela `Transacoes`, model Sequelize e endpoints REST sob `/transacoes`.
4. Comandos de validação: `npm run lint` e `npm run build` (auditam frontend e backend).
5. Execução do backend: `npm run server` (rodando na porta 3001).
