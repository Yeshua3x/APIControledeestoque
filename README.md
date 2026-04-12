# Stock API - Netlify Functions

Projeto mínimo de API de controle de estoque usando Netlify Functions (Node.js + SQLite para protótipo).

---  

## Requisitos locais
- Node.js (16+)
- npm
- netlify-cli (opcional para dev local)

## Scripts
- npm install
- npm run dev  (inicia `netlify dev`)
- npm run build (placeholder)

## Como usar
1. Instale dependências:
   npm install

2. Rodar localmente:
   netlify dev

3. Conectar ao Netlify:
   - No Netlify: New site → Import from Git → selecione o repositório.
   - Build command: npm run build
   - Functions directory: netlify/functions
   - Publish directory: public

4. Variáveis de ambiente (Site settings → Build & deploy → Environment):
   - SQLITE_DB_PATH = /tmp/data.db  (opcional)
   - API_KEY = sua_chave_secreta
   - DATABASE_URL = postgres://...  (se usar DB remoto)

## Notas
- SQLite é apenas para protótipo; em produção use um DB gerenciado (Postgres/Supabase/Neon).
- Armazene segredos apenas nas Environment Variables do Netlify.
- Para testar endpoints: use Postman, Hoppscotch ou curl.

## Estrutura do projeto
- netlify/functions/    → funções serverless (endpoints CRUD)
- src/db.js             → lógica de acesso ao banco
- netlify.toml
- package.json
- .gitignore

