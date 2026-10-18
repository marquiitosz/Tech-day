# Progresso do Projeto EmpreendaFácil

## 1. Estado atual
Foram concluídas com sucesso as correções dos 4 problemas críticos, dos 9 problemas de alta prioridade, a **Fase 2 (Migração Financeira)** e a **Fase 3 (Migração Operacional de Atividades, V2Configurações e Integração Global de Navegação)**. A tabela `Atividades` foi modelada com migration Sequelize (`src/database/migrations/202610180003-create-atividades.cjs`), vinculada a `Usuarios` com exclusão em cascata. O model `AtividadeModel` foi adicionado em `src/repository/persistency.ts`, e o controller `atividadesController.ts` foi montado sob `/atividades` (`GET /`, `POST /`, `DELETE /`). No frontend, foi criado `OperacaoApiRepository.ts`, a tela `Historico.tsx` foi conectada à API REST com exportação de CSV funcional, a rota protegida `/configuracoes` foi migrada para a tela Clean Architecture `V2Configuracoes.tsx`, a Navbar recebeu links diretos e o Dashboard foi integrado com atalhos de navegação.

## 2. Próximos passos
1. Iniciar o serviço local do MySQL e executar as migrations (`npm run db:migrate`).
2. Iniciar o servidor backend na porta 3001 (`npm run server`).
3. Iniciar o frontend Vite na porta 5173 (`npm run dev`).
4. Realizar testes de ponta a ponta: cadastro, login, lançamentos financeiros, registro de atividades operacionais, exportação CSV e gerenciamento de perfil.

## 3. Decisões em aberto
- Nenhuma decisão bloqueante em aberto. Todos os fluxos principais (Autenticação, Financeiro, Operacional e IA Chatbot) contam com persistência no MySQL, controllers modulares REST e adaptadores de frontend com fallback seguro.

## 4. Autorizações concedidas
- Adição da variável `JWT_SECRET=` e variáveis `DB_*` ao arquivo `.env.example`: **Autorizada**.
- Remoção da rota `GET /users`: **Autorizada**.
- Inclusão de página 404 e rota coringa `*`: **Autorizada**.
- Migração de dados financeiros via backend/API (Opção C): **Autorizada para planejamento e execução em fases**.
- Implementação da Fase 2 da Migração Financeira (Migration Transacoes, TransacaoModel, transacoesController REST e FinanceiroApiRepository): **Executada com sucesso**.
- Implementação da Fase 3 (Migration Atividades, AtividadeModel, atividadesController REST, OperacaoApiRepository, V2Configuracoes e Navbar unificada): **Executada com sucesso**.
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

### [2026-10-18 18:54] — Módulo de Artigos e Guias de Empreendedorismo

- **Status:** Concluído
- **Objetivo:** Inserir 5 artigos educativos sobre empreendedorismo (validação de ideia/MVP, guia MEI, separação de contas/pró-labore, marketing local sem custos e reserva de emergência/capital de giro) sem alterar o tema visual, rotas nem lógica de negócio existente.
- **O que foi feito:**
  - **Dados Isolados:** Criado `src/frontend/src/data/artigosEmpreendedorismo.ts` contendo interface tipada e acervo de 5 artigos completos com subtítulos, pontos-chave, conclusões práticas e avisos legais.
  - **Componentes Dedicados:**
    - `src/frontend/src/components/artigos/ArtigoCard.tsx`: Card responsivo reutilizando Tailwind do projeto.
    - `src/frontend/src/components/artigos/ArtigoModal.tsx`: Leitor em modal semântico com navegação por teclado (`Escape`).
    - `src/frontend/src/components/artigos/SecaoArtigos.tsx`: Seção orquestradora com filtros de categoria e busca textual em tempo real.
  - **Integração:** Adicionada apenas 1 linha de import e 1 linha de renderização (`<SecaoArtigos />`) em `src/frontend/src/components/Conteudos.tsx`.
- **Arquivos alterados / criados:**
  - `src/frontend/src/data/artigosEmpreendedorismo.ts` — Arquivo novo (base de dados de artigos).
  - `src/frontend/src/components/artigos/ArtigoCard.tsx` — Arquivo novo (card de artigo).
  - `src/frontend/src/components/artigos/ArtigoModal.tsx` — Arquivo novo (modal semântica).
  - `src/frontend/src/components/artigos/SecaoArtigos.tsx` — Arquivo novo (seção orquestradora).
  - `src/frontend/src/components/Conteudos.tsx` — Ponto de inserção do componente.
- **Impacto no comportamento:** Usuários que acessam a rota `/conteudos` agora têm acesso a uma seção de artigos com filtros por categoria e leitor completo sem qualquer quebra nas funcionalidades prévias.
- **Validação:** Inspeção estática de tipos TypeScript, sem `dangerouslySetInnerHTML`, sem dependências externas.
- **Como reverter:** Remover a pasta `src/frontend/src/components/artigos/`, o arquivo `src/frontend/src/data/artigosEmpreendedorismo.ts` e as duas linhas adicionadas em `src/frontend/src/components/Conteudos.tsx`.

### [2026-10-18 18:36] — Fase 3: Migração Operacional de Atividades, V2Configurações e Navegação Integrada

- **Status:** Concluído
- **Objetivo:** Persistir o histórico de atividades no banco MySQL, unificar as rotas com a Clean Architecture V2 (`V2Configuracoes`), integrar a barra de navegação superior para usuários autenticados e tornar funcional a exportação de dados em CSV.
- **O que foi feito:**
  - **Migration Atividades:** Criada `src/database/migrations/202610180003-create-atividades.cjs` com tabela `Atividades`, chave estrangeira `usuarioId` (`ON DELETE CASCADE`), campos `titulo`, `categoria` (`ENUM`), `status` (`ENUM`), `data`, `horario`, `valorFormatado` e índice em `usuarioId`.
  - **Model Sequelize:** Adicionado `AtividadeModel` em `src/repository/persistency.ts` com tipagem estrita (`AtividadeAttributes`, `AtividadeCreationAttributes`) e relacionamento com `UsuarioModel`.
  - **Controller REST:** Criado `src/backend/src/operacao/atividadesController.ts` com rotas `GET /atividades` (com suporte a limite), `POST /atividades` e `DELETE /atividades` protegidas por JWT.
  - **Servidor:** Montado roteador em `server.ts` sob `/atividades`.
  - **Frontend Repositório:** Criado `OperacaoApiRepository.ts` implementando `IOperacaoRepository` com consumo da API REST e contingência de fallback local.
  - **Histórico & CSV:** Atualizado `Historico.tsx` para carregar atividades da API REST e exportar arquivo CSV real com download via Blob.
  - **Migração V2Configurações:** Exportada `V2Configuracoes` e substituída a tela legada na rota protegida `/configuracoes` em `App.tsx`.
  - **Navegação:** Adicionados atalhos diretos na `Navbar.tsx` para Dashboard, Financeiro e Histórico quando logado, e botão de atalho para Histórico no `V2Dashboard.tsx`.
  - **Auditoria Financeira Cruzada:** Integrado disparo assíncrono em `FinanceiroApiRepository.ts` para registrar automaticamente receitas e despesas no histórico de `/atividades`.
  - **Padronização Chatbot:** Ajustado o fallback da porta da API em `chatbotService.ts` de 3000 para 3001.
- **Arquivos alterados / criados:**
  - `src/database/migrations/202610180003-create-atividades.cjs` — Arquivo novo (migration de Atividades).
  - `src/repository/persistency.ts` — Adicionado `AtividadeModel` e associações.
  - `src/backend/src/operacao/atividadesController.ts` — Arquivo novo (controller de atividades).
  - `src/backend/src/server.ts` — Montado `atividadesRouter`.
  - `src/frontend/src/v2/infrastructure/repositories/OperacaoApiRepository.ts` — Arquivo novo.
  - `src/frontend/src/v2/infrastructure/repositories/FinanceiroApiRepository.ts` — Adicionada auditoria automática em `/atividades`.
  - `src/frontend/src/chatbot/chatbotService.ts` — Atualizado fallback de porta para 3001.
  - `src/frontend/src/components/Historico.tsx` — Conectado à API e com exportação CSV real.
  - `src/frontend/src/v2/presentation/pages/index.ts` — Exportada `V2Configuracoes`.
  - `src/frontend/src/App.tsx` — Rota `/configuracoes` apontando para `V2Configuracoes`.
  - `src/frontend/src/components/Navbar.tsx` — Links diretos de navegação para usuários autenticados.
  - `src/frontend/src/v2/presentation/pages/V2Dashboard.tsx` — Botão apontando para o Histórico de Atividades e confirmação de exclusão em `V2Relatorios.tsx`.
- **Impacto no comportamento:** Usuários autenticados agora têm experiência coesa e unificada em todas as telas V2, com histórico de atividades operacional persistido e exportável, e configurações com logout seguro.
- **Validação:** Checagem estática de sintaxe e tipos TypeScript.
- **Pendências e bloqueios:** Nenhuma no código. Necessário rodar `npm run db:migrate` quando o MySQL estiver ativo.
- **Próximo passo exato:** Executar `npm run db:migrate` e iniciar os servidores (`npm run server` e `npm run dev`).

### [2026-10-18 18:30] — Fase 2 da Migração Financeira (Migration, Model, Controller REST e Frontend Adapter)

- **Status:** Concluído
- **Objetivo:** Implementar persistência definitiva de transações financeiras no banco MySQL via API REST autenticada, substituindo o armazenamento exclusivo em localStorage sem romper a Clean Architecture e mantendo zero dependências externas adicionais.
- **O que foi feito:**
  - **Migration Sequelize:** Criada `src/database/migrations/202610180002-create-transacoes.cjs` criando a tabela `Transacoes` com chave estrangeira `usuarioId` referenciando `Usuarios(id)` com `ON DELETE CASCADE` e `ON UPDATE CASCADE`, campos `valorCentavos` (`BIGINT`), `tipo` (`ENUM`), `status` (`ENUM`), `categoria`, `descricao`, `data` e índice em `usuarioId`.
  - **Model Sequelize:** Implementado `TransacaoModel` em `src/repository/persistency.ts` com tipagem forte (`TransacaoAttributes`, `TransacaoCreationAttributes`), mapeamento de campos e associações bidirecionais (`UsuarioModel.hasMany(TransacaoModel)` e `TransacaoModel.belongsTo(UsuarioModel)`).
  - **Controller REST:** Criado `src/backend/src/transacoes/transacoesController.ts` com middleware de autenticação JWT dedicado e rotas protegidas:
    - `GET /transacoes`: Lista transações do usuário logado ordenadas por criação decrescente com `valorCentavos` convertido para número inteiro.
    - `POST /transacoes`: Validação estrita de corpo, descrição, categoria, tipo (`ENTRADA`/`SAIDA`), status (`CONCLUIDO`/`PENDENTE`) e valor positivo em centavos (com suporte a `valorCentavos`, `centavos` ou `valor`).
    - `DELETE /transacoes/:id`: Exclui transação garantindo isolamento por usuário (`usuarioId`).
    - `DELETE /transacoes`: Limpa todas as transações do usuário logado (mapeando para `limparTodas()`).
    - `POST /transacoes/importar`: Importação em lote idempotente de transações (ex.: migração de dados legados do localStorage) com validação e prevenção de duplicatas por ID.
  - **Servidor:** Montado o router em `server.ts` sob `/transacoes`.
  - **Frontend Adapter:** Criado `FinanceiroApiRepository.ts` implementando fielmente `IFinanceiroRepository` com integração JWT via `localStorage.getItem('token')`, suporte a `VITE_API_URL` (com fallback para porta 3001), sincronização idempotente de transações pré-existentes no `localStorage` e fallback seguro de contingência caso a rede falhe.
  - **Integração nas Páginas:** Atualizados `V2Dashboard.tsx` e `V2Relatorios.tsx` para instanciar `FinanceiroApiRepository`, sincronizando automaticamente no carregamento inicial.
  - **Ambiente:** Criado arquivo `.env` local com chave `JWT_SECRET` criptográfica e adicionada a variável `VITE_API_URL=http://localhost:3001` ao `.env.example`.
- **Arquivos alterados / criados:**
  - `src/database/migrations/202610180002-create-transacoes.cjs` — Arquivo novo (migration da tabela Transacoes).
  - `src/repository/persistency.ts` — Adicionados `TransacaoModel`, tipagens e associações com `UsuarioModel`.
  - `src/types/tipo.ts` — Adicionados tipos `TipoTransacao`, `StatusTransacao` e interface `TransacaoDTO`.
  - `src/backend/src/transacoes/transacoesController.ts` — Arquivo novo (rotas REST e validações de transações).
  - `src/backend/src/server.ts` — Importado e montado `transacoesRouter`.
  - `src/frontend/src/v2/infrastructure/repositories/FinanceiroApiRepository.ts` — Arquivo novo (repositório API frontend).
  - `src/frontend/src/v2/presentation/pages/V2Dashboard.tsx` — Repositório atualizado para `FinanceiroApiRepository` com sincronização.
  - `src/frontend/src/v2/presentation/pages/V2Relatorios.tsx` — Repositório atualizado para `FinanceiroApiRepository` com sincronização.
  - `.env` — Arquivo criado com `JWT_SECRET` de 256 bits gerado criptograficamente.
  - `.env.example` — Adicionada variável `VITE_API_URL=http://localhost:3001`.
- **Impacto no comportamento:** Os dados financeiros passam a ser persistidos de forma segura e relacional no MySQL sob o ID do usuário conectado. Caso o usuário possuísse dados locais em cache no navegador, eles são importados e unificados no backend via endpoint idempotente. O sistema mantém compatibilidade offline caso a API esteja temporariamente indisponível.
- **Validação:** Inspeção estática de tipagem TypeScript com `verbatimModuleSyntax` e verificação de compatibilidade de interface `IFinanceiroRepository`.
- **Decisões tomadas e motivo:**
  - Valores em centavos (`BIGINT`) adotados para eliminar qualquer erro de ponto flutuante em somas contábeis.
  - Identificador `id` como `STRING(64)` permitindo preservar IDs `tx_...` de transações existentes na importação sem criar duplicatas.
  - Exclusão física com `ON DELETE CASCADE` garantindo que a remoção de um usuário limpe suas transações filhas automaticamente.
  - Controller modularizado em diretório próprio para manter o `server.ts` limpo e sustentável.
- **Pendências e bloqueios:** Nenhuma pendência de código. Necessidade apenas de rodar as migrations no MySQL local quando o serviço de banco for iniciado (`npm run db:migrate`).
- **Próximo passo exato:** Executar `npm run db:migrate` com o banco MySQL ativo e iniciar os servidores frontend e backend.

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
1. Ler este arquivo [`docs/PROGRESSO.md`](file:///c:/Users/Arthur/Tech-day/docs/PROGRESSO.md) integralmente.
2. Certificar-se de que o serviço MySQL local está rodando e executar as migrations:
   `npm run db:migrate`
3. Executar o servidor backend:
   `npm run server` (rodando na porta 3001).
4. Executar o frontend Vite:
   `npm run dev` (rodando na porta 5173).
5. Comandos de validação e lint:
   `npm run lint` e `npm run build`.

