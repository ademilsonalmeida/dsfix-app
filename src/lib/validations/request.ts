import { z } from "zod";

export const createRequestSchema = z.object({
  equipamentoId: z.string().uuid("ID do equipamento inválido"),
  solicitanteNome: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  solicitanteDepartamento: z
    .string()
    .min(2, "Departamento deve ter no mínimo 2 caracteres")
    .max(50, "Departamento deve ter no máximo 50 caracteres"),
  descricao: z
    .string()
    .min(10, "Descrição deve ter no mínimo 10 caracteres")
    .max(1000, "Descrição deve ter no máximo 1000 caracteres"),
  urgencia: z.enum(["ALTA", "MEDIA", "BAIXA"], {
    errorMap: () => ({ message: "Urgência inválida" }),
  }),
  fotoUrl: z.string().url("URL da foto inválida").optional().or(z.literal("")),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
