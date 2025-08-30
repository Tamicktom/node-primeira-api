# API de Cursos - Primeira API Node.js

Uma API REST simples para gerenciamento de cursos, desenvolvida com Node.js, TypeScript e Fastify. Este projeto serve como exemplo de uma primeira API com operações CRUD básicas.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Fastify** - Framework web rápido e eficiente
- **Drizzle ORM** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação e tipagem de dados
- **Docker** - Containerização do banco de dados

## 📋 Pré-requisitos

- Node.js (versão 20 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd node-primeira-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Inicie o PostgreSQL usando Docker
docker-compose up -d
```

### 4. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapp
```

### 5. Execute as migrações do banco
```bash
npm run db:migrate
```

### 6. (Opcional) Popular o banco de desenvolvimento com dados de exemplo
```bash
npm run db:seed
```

## ▶️ Executando o Projeto

### Modo de Desenvolvimento
```bash
npm run dev
```
O servidor será iniciado em `http://localhost:3333` com hot-reload ativado.

### Modo de Produção
```bash
npm start
```

## 📚 Documentação da API

A API possui documentação interativa disponível em:
```
http://localhost:3333/swagger
```

## 🛠️ Endpoints da API

### Cursos

#### GET /courses
Retorna uma lista de todos os cursos.

**Resposta:**
```json
[
  {
    "id": "uuid",
    "title": "Título do curso"
  }
]
```

#### POST /courses
Cria um novo curso.

**Corpo da requisição:**
```json
{
  "title": "Título do curso",
  "description": "Descrição detalhada do curso"
}
```

**Resposta:**
```json
{
  "id": "uuid-do-curso"
}
```

#### GET /courses/:id
Retorna um curso específico pelo ID.

## 🗄️ Estrutura do Banco de Dados

### Tabela `courses`
- `id` - UUID (chave primária)
- `title` - Título do curso (obrigatório)
- `description` - Descrição do curso (obrigatório)
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

### Tabela `users`
- `id` - UUID (chave primária)
- `name` - Nome do usuário (obrigatório)
- `email` - Email único (obrigatório)
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

## 🧪 Testando a API

O projeto inclui um arquivo `requests.http` com exemplos de requisições que você pode usar para testar a API diretamente no VS Code ou usando extensões como REST Client.

### Exemplos de uso:

1. **Listar cursos:**
   ```http
   GET http://localhost:3333/courses
   ```

2. **Criar um novo curso:**
   ```http
   POST http://localhost:3333/courses
   Content-Type: application/json

   {
     "title": "Deno",
     "description": "Deno é um runtime para JavaScript e TypeScript."
   }
   ```

3. **Buscar curso por ID:**
   ```http
   GET http://localhost:3333/courses/43e6f7d8-eeb9-482e-bfd0-ae53edd7c636
   ```

## ✅ Testes automatizados

Os testes são escritos com Vitest e Supertest, executados contra um banco de dados de teste.

### 1. Configurar o ambiente de teste
- Crie um arquivo `.env.test` na raiz do projeto com a URL do banco de teste (o `docker/setup.sql` já cria o banco `myapptest` automaticamente):
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapptest
```
- Garanta que o PostgreSQL está rodando via Docker:
```bash
docker-compose up -d
```

### 2. Executar os testes (com cobertura)
```bash
npm test
```
O comando acima irá:
- aplicar as migrações no banco de teste automaticamente (script `pretest`)
- executar os testes com cobertura (Vitest + cobertura V8)

### 3. Relatórios de cobertura
- Resumo no terminal após a execução
- Relatório HTML em `coverage/index.html`

### 4. Dicas úteis
- Rodar em modo watch (interativo):
```bash
dotenv -e .env.test vitest
```
- Rodar um arquivo de teste específico:
```bash
dotenv -e .env.test vitest run src/tests/get-courses.test.ts
```

## 📁 Estrutura do Projeto

```
node-primeira-api/
├── src/
│   ├── database/
│   │   ├── client.ts      # Configuração do banco de dados
│   │   └── schema.ts      # Esquema das tabelas
│   └── routes/
│       ├── create-course.ts   # Rota para criar cursos
│       ├── get-courses.ts     # Rota para listar cursos
│       └── get-course-by-id.ts # Rota para buscar curso por ID
├── drizzle/              # Migrações do banco de dados
├── requests.http         # Exemplos de requisições HTTP
├── server.ts             # Arquivo principal do servidor
├── package.json          # Dependências e scripts
├── docker-compose.yml    # Configuração do PostgreSQL
├── drizzle.config.ts     # Configuração do Drizzle
└── tsconfig.json         # Configuração do TypeScript
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm start` - Inicia o servidor em modo de produção
- `npm test` - Executa os testes com cobertura (usa `.env.test` e migra antes)
- `npm run db:migrate` - Executa migrações em dev e também no ambiente de teste
- `npm run db:seed` - Popula o banco de desenvolvimento com dados iniciais

## 📈 Próximos Passos

Este projeto é uma base sólida para desenvolvimento de APIs. Possíveis melhorias incluem:

- Implementação de autenticação e autorização
- Validação mais robusta dos dados
- Adição de mais endpoints (atualização e exclusão de cursos)
- Implementação de paginação
- Adição de filtros e busca
- Logs mais detalhados
- Rate limiting
- Documentação mais completa

---

**Nota:** Este é um projeto educacional para demonstrar conceitos fundamentais de desenvolvimento de APIs REST com Node.js.