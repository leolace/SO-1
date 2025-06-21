# Projeto SO Frontend

Este é frontend do projeto de SO construído com React, Vite, TypeScript e Remix v7, que roda, por debaixo dos panos, código em C por meio de chamadas ao servidor.

## Pré-requisitos
- Node.js (recomendado: versão 18+)
- pnpm (ou npm/yarn)
- Docker (opcional, para rodar via container)
- gcc

## Instalação
1. Instale as dependências (certifique-se de que os scripts de post-install foram executados):
   ```bash
   pnpm install
   # ou
   npm install
   # ou
   yarn install
   ```
2. Verifique se o banco de dados está configurado e rodando corretamente:
   - Certifique-se de que o arquivo `.env` está configurado com as variáveis necessárias (`DATABASE_URL`).
   - Se estiver usando Docker, o banco de dados será iniciado automaticamente pelo `docker-compose`.
3. Rodar migrations Prisma (se necessário):
  ```bash
  pnpm migrate
  ```

## Rodando Localmente
Execute o servidor de desenvolvimento:
```bash
pnpm run dev
# ou
npm run dev
# ou
yarn dev
```
O frontend local estará disponível em `http://localhost:3000`.

## Rodando com Docker
1. Para buildar a imagem:
   ```bash
   docker-compose build
   ```
2. Para rodar o container:
   ```bash
   docker-compose up
   ```
3. Ou tudo de uma vez:
   ```bash
   docker-compose up --build
   ```

A aplicação Docker irá subir em `http://localhost:9191`

## Estrutura de Pastas
- `app/` — Código principal do frontend
  - `api/` — Funções para comunicação com a API (ex: client.ts, comment.ts, comments.ts, run.ts)
  - `components/` — Componentes reutilizáveis (ex: code-run, code-section, comments-area, output, spinner, typography)
  - `layout/` — Layouts e providers globais
  - `pages/` — Páginas do app, organizadas por checkpoint (ex: checkpoint-1, checkpoint-2, checkpoint-3, home)
- `public/` — Arquivos estáticos
- `prisma/` — Configuração do banco de dados
- `build/` — Build de produção (gerado pelo Vite)
- `docker-compose.yml` — Configuração do Docker Compose
- `vite.config.ts` — Configuração do Vite
- `tsconfig.json` — Configuração do TypeScript
- `package.json` — Dependências e scripts do projeto

## Estrutura de Rotas
As rotas são definidas em `react-router.config.ts` e `app/routes.ts`:
- `/` — Página inicial (home)
- `/checkpoint-1` — Página do Checkpoint 1
- `/checkpoint-2` — Página do Checkpoint 2
- `/checkpoint-3` — Página do Checkpoint 3

Cada rota carrega um componente/página correspondente em `app/pages/`.

## API
A comunicação com a API é feita via arquivos em `app/api/`:
- `client.ts` — Configuração do cliente HTTP
- `comment.ts`, `comments.ts` — Endpoints para comentários
- `run.ts` — Endpoint para execução de código

Os métodos usam a variável `client` (criada pelo `axios`) para consumir endpoints REST, definidos conforme a necessidade do backend.

## Uso do React Query
O projeto utiliza o React Query para gerenciamento eficiente de dados assíncronos e cache de requisições à API. Com ele, as chamadas HTTP (como busca de comentários, execução de código, etc.) são feitas de forma otimizada, com cache automático, revalidação e atualização em tempo real dos dados.

### Principais Vantagens
- Cache automático de dados de API
- Atualização automática dos dados em tela após mutações
- Gerenciamento de estados de loading, erro e sucesso
- Refetch e invalidação de queries facilitados

### Exemplos de Uso
- Os hooks `useQuery` e `useMutation` são utilizados nos componentes para buscar e enviar dados:
  - Exemplo: `app/components/comments-area/queries.ts` usa `useQuery` para buscar comentários e `useMutation` para adicionar novos.
  - Exemplo: `app/components/code-run/queries.ts` usa `useMutation` para executar código e atualizar o resultado.

## Scripts Úteis
- `pnpm dev` — Inicia o servidor de desenvolvimento
- `pnpm build` — Gera build de produção
- `pnpm start` — Visualiza build de produção localmente
- `pnpm migrate` — Executa migrations do Prisma
- `pnpm compile` — Compila o código C

---

Para dúvidas ou contribuições, consulte os arquivos de cada pasta ou abra uma issue no repositório.
