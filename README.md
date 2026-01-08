# DSFix - Sistema de Gestão de Manutenções

Sistema web para solicitação e gestão de manutenções de equipamentos internos, com abertura de chamados via QR Code e painel administrativo.

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM
- **Autenticação**: NextAuth.js
- **UI**: shadcn/ui + Tailwind CSS
- **Hospedagem**: Vercel
- **Upload de Arquivos**: Vercel Blob

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd dsfix-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
- `DATABASE_URL`: String de conexão do PostgreSQL
- `NEXTAUTH_SECRET`: Chave secreta (gere com `openssl rand -base64 32`)
- `BLOB_READ_WRITE_TOKEN`: Token do Vercel Blob (configurar após deploy)

4. Execute as migrações do banco de dados:
```bash
npm run db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── app/                      # Rotas Next.js (App Router)
│   ├── (public)/            # Rotas públicas (sem autenticação)
│   │   ├── equipamentos/    # QR Code landing pages
│   │   ├── solicitar/       # Busca e solicitação
│   │   └── confirmacao/     # Confirmação de solicitação
│   ├── (admin)/             # Rotas protegidas (admin)
│   │   └── admin/
│   │       ├── equipamentos/  # Gestão de equipamentos
│   │       └── usuarios/      # Gestão de usuários
│   └── api/auth/            # NextAuth.js endpoints
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── forms/               # Formulários
│   └── admin/               # Componentes do dashboard
├── lib/
│   ├── db/                  # Drizzle schema e client
│   ├── actions/             # Server Actions
│   ├── validations/         # Schemas Zod
│   └── auth.ts              # Configuração NextAuth
└── types/                   # TypeScript types
```

## 🗃️ Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
npm run db:generate  # Gera migrações Drizzle
npm run db:migrate   # Executa migrações
npm run db:push      # Push schema para DB (dev)
npm run db:studio    # Abre Drizzle Studio
```

## 🎯 Funcionalidades

### Colaborador (Sem Autenticação)
- ✅ Escanear QR Code do equipamento
- ✅ Buscar equipamento por nome/código/local
- ✅ Abrir solicitação de manutenção
- ✅ Upload de foto do problema
- ✅ Receber número de confirmação

### Administrador (Com Autenticação)
- ✅ Dashboard com lista de solicitações
- ✅ Filtrar por status e urgência
- ✅ Atribuir responsável
- ✅ Atualizar status das solicitações
- ✅ Gerenciar equipamentos (CRUD)
- ✅ Gerar e imprimir QR Codes

## 🔐 Segurança

- Autenticação JWT via NextAuth.js
- Senhas hasheadas com bcrypt
- Middleware de proteção de rotas admin
- Validação de dados com Zod
- HTTPS obrigatório em produção

## 🚢 Deploy na Vercel

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `BLOB_READ_WRITE_TOKEN`
3. Deploy automático a cada push

## 📝 Próximos Passos

- [ ] Implementar schema do banco de dados (Task 2)
- [ ] Configurar autenticação completa (Task 3)
- [ ] Criar fluxo de solicitação de colaboradores (Task 4)
- [ ] Desenvolver dashboard admin (Task 5)
- [ ] Implementar gestão de equipamentos (Task 6)
- [ ] Adicionar seed data e polish (Task 7)

## 📄 Licença

Proprietário - DSFix

---

Desenvolvido com ❤️ usando Next.js 15
