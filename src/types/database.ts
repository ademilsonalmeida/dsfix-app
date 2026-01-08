import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { equipamentos, solicitacoes, historicoStatus, adminUsers } from "@/lib/db/schema";

// Equipamentos Types
export type Equipamento = InferSelectModel<typeof equipamentos>;
export type NovoEquipamento = InferInsertModel<typeof equipamentos>;

// Admin Users Types
export type AdminUser = InferSelectModel<typeof adminUsers>;
export type NovoAdminUser = InferInsertModel<typeof adminUsers>;

// Solicitações Types
export type Solicitacao = InferSelectModel<typeof solicitacoes>;
export type NovaSolicitacao = InferInsertModel<typeof solicitacoes>;

// Histórico Status Types
export type HistoricoStatus = InferSelectModel<typeof historicoStatus>;
export type NovoHistoricoStatus = InferInsertModel<typeof historicoStatus>;

// Enums
export type StatusSolicitacao = "PENDENTE" | "EM_ANDAMENTO" | "FINALIZADO" | "CANCELADO";
export type UrgenciaSolicitacao = "ALTA" | "MEDIA" | "BAIXA";
