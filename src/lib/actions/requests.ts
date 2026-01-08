"use server";

import { db } from "@/lib/db";
import { solicitacoes, historicoStatus } from "@/lib/db/schema";
import { createRequestSchema } from "@/lib/validations/request";
import { eq } from "drizzle-orm";

function generateRequestNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return "REQ-" + timestamp + random;
}

export async function createRequest(data: unknown) {
  try {
    const validated = createRequestSchema.parse(data);

    const numero = generateRequestNumber();

    const [newRequest] = await db
      .insert(solicitacoes)
      .values({
        numero,
        equipamentoId: validated.equipamentoId,
        solicitanteNome: validated.solicitanteNome,
        solicitanteDepartamento: validated.solicitanteDepartamento,
        descricao: validated.descricao,
        urgencia: validated.urgencia,
        status: "PENDENTE",
        fotoUrl: validated.fotoUrl || null,
      })
      .returning();

    await db.insert(historicoStatus).values({
      solicitacaoId: newRequest.id,
      statusAnterior: null,
      statusNovo: "PENDENTE",
      observacao: "Solicitação criada",
    });

    return {
      success: true,
      data: {
        id: newRequest.id,
        numero: newRequest.numero,
      },
    };
  } catch (error) {
    console.error("Error creating request:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao criar solicitação" };
  }
}

export async function getRequestById(id: string) {
  try {
    const request = await db.query.solicitacoes.findFirst({
      where: eq(solicitacoes.id, id),
      with: {
        equipamento: true,
      },
    });

    if (!request) {
      return { success: false, error: "Solicitação não encontrada" };
    }

    return { success: true, data: request };
  } catch (error) {
    console.error("Error fetching request:", error);
    return { success: false, error: "Erro ao buscar solicitação" };
  }
}
