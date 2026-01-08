import { relations } from "drizzle-orm";
import { equipamentos, solicitacoes, historicoStatus, adminUsers } from "./schema";

// Equipamentos relations
export const equipamentosRelations = relations(equipamentos, ({ many }) => ({
  solicitacoes: many(solicitacoes),
}));

// Admin Users relations
export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  solicitacoesResponsavel: many(solicitacoes),
  historicoAlteracoes: many(historicoStatus),
}));

// Solicitações relations
export const solicitacoesRelations = relations(solicitacoes, ({ one, many }) => ({
  equipamento: one(equipamentos, {
    fields: [solicitacoes.equipamentoId],
    references: [equipamentos.id],
  }),
  responsavel: one(adminUsers, {
    fields: [solicitacoes.responsavelId],
    references: [adminUsers.id],
  }),
  historico: many(historicoStatus),
}));

// Histórico Status relations
export const historicoStatusRelations = relations(historicoStatus, ({ one }) => ({
  solicitacao: one(solicitacoes, {
    fields: [historicoStatus.solicitacaoId],
    references: [solicitacoes.id],
  }),
  alteradoPor: one(adminUsers, {
    fields: [historicoStatus.alteradoPorId],
    references: [adminUsers.id],
  }),
}));
