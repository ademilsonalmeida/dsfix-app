import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

// Equipamentos (Equipment Registry)
export const equipamentos = pgTable("equipamentos", {
  id: uuid("id").primaryKey().defaultRandom(),
  codigo: varchar("codigo", { length: 20 }).unique().notNull(),
  nome: varchar("nome", { length: 100 }).notNull(),
  categoria: varchar("categoria", { length: 50 }).notNull(),
  local: varchar("local", { length: 100 }).notNull(),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  nome: varchar("nome", { length: 100 }).notNull(),
  senhaHash: varchar("senha_hash", { length: 255 }).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
});

// Solicitações de Manutenção (Maintenance Requests)
export const solicitacoes = pgTable("solicitacoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  numero: varchar("numero", { length: 20 }).unique().notNull(),
  equipamentoId: uuid("equipamento_id").references(() => equipamentos.id).notNull(),
  solicitanteNome: varchar("solicitante_nome", { length: 100 }).notNull(),
  solicitanteDepartamento: varchar("solicitante_departamento", { length: 50 }).notNull(),
  descricao: text("descricao").notNull(),
  urgencia: varchar("urgencia", { length: 10 }).default("MEDIA").notNull(),
  status: varchar("status", { length: 20 }).default("PENDENTE").notNull(),
  responsavelId: uuid("responsavel_id").references(() => adminUsers.id),
  fotoUrl: varchar("foto_url", { length: 500 }),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
  finalizadoEm: timestamp("finalizado_em"),
});

// Histórico de Status (Status History for Audit Trail)
export const historicoStatus = pgTable("historico_status", {
  id: uuid("id").primaryKey().defaultRandom(),
  solicitacaoId: uuid("solicitacao_id").references(() => solicitacoes.id).notNull(),
  statusAnterior: varchar("status_anterior", { length: 20 }),
  statusNovo: varchar("status_novo", { length: 20 }).notNull(),
  alteradoPorId: uuid("alterado_por_id").references(() => adminUsers.id),
  observacao: text("observacao"),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),
});
