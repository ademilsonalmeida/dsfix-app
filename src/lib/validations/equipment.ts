import { z } from "zod";

export const createEquipmentSchema = z.object({
  codigo: z
    .string()
    .min(1, "Código é obrigatório")
    .max(20, "Código deve ter no máximo 20 caracteres")
    .regex(/^[A-Z0-9-]+$/, "Código deve conter apenas letras maiúsculas, números e hífens"),
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  categoria: z
    .string()
    .min(2, "Categoria deve ter pelo menos 2 caracteres")
    .max(50, "Categoria deve ter no máximo 50 caracteres"),
  local: z
    .string()
    .min(2, "Local deve ter pelo menos 2 caracteres")
    .max(100, "Local deve ter no máximo 100 caracteres"),
  observacoes: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional(),
});

export const updateEquipmentSchema = createEquipmentSchema.partial().extend({
  id: z.string().uuid("ID inválido"),
});

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
