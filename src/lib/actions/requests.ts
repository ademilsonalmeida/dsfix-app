"use server";

import { db } from "@/lib/db";
import { solicitacoes, historicoStatus, adminUsers } from "@/lib/db/schema";
import { createRequestSchema } from "@/lib/validations/request";
import { eq, and, or, ilike, desc } from "drizzle-orm";

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

// Admin Dashboard Functions

export interface RequestFilters {
  status?: string;
  urgencia?: string;
  search?: string;
}

export async function getRequests(filters?: RequestFilters) {
  try {
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(solicitacoes.status, filters.status));
    }

    if (filters?.urgencia) {
      conditions.push(eq(solicitacoes.urgencia, filters.urgencia));
    }

    if (filters?.search) {
      const searchTerm = "%" + filters.search.trim() + "%";
      conditions.push(
        or(
          ilike(solicitacoes.solicitanteNome, searchTerm),
          ilike(solicitacoes.numero, searchTerm)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const requests = await db.query.solicitacoes.findMany({
      where: whereClause,
      with: {
        equipamento: true,
        responsavel: true,
      },
      orderBy: [desc(solicitacoes.criadoEm)],
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching requests:", error);
    return { success: false, error: "Erro ao buscar solicitações" };
  }
}

export async function getRequestDetail(id: string) {
  try {
    const request = await db.query.solicitacoes.findFirst({
      where: eq(solicitacoes.id, id),
      with: {
        equipamento: true,
        responsavel: true,
        historico: {
          with: {
            alteradoPor: true,
          },
          orderBy: (historico, { desc }) => [desc(historico.criadoEm)],
        },
      },
    });

    if (!request) {
      return { success: false, error: "Solicitação não encontrada" };
    }

    return { success: true, data: request };
  } catch (error) {
    console.error("Error fetching request detail:", error);
    return { success: false, error: "Erro ao buscar detalhes da solicitação" };
  }
}

export async function updateRequestStatus(
  requestId: string,
  newStatus: string,
  userId?: string,
  observation?: string
) {
  try {
    // Get current request
    const current = await db.query.solicitacoes.findFirst({
      where: eq(solicitacoes.id, requestId),
    });

    if (!current) {
      return { success: false, error: "Solicitação não encontrada" };
    }

    // Update request status
    const updateData: Record<string, unknown> = {
      status: newStatus,
      atualizadoEm: new Date(),
    };

    if (newStatus === "FINALIZADO") {
      updateData.finalizadoEm = new Date();
    }

    await db.update(solicitacoes).set(updateData).where(eq(solicitacoes.id, requestId));

    // Create history record
    await db.insert(historicoStatus).values({
      solicitacaoId: requestId,
      statusAnterior: current.status,
      statusNovo: newStatus,
      alteradoPorId: userId || null,
      observacao: observation || null,
    });

    return { success: true, data: { status: newStatus } };
  } catch (error) {
    console.error("Error updating request status:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao atualizar status" };
  }
}

export async function assignResponsible(requestId: string, responsibleId: string | null) {
  try {
    await db
      .update(solicitacoes)
      .set({
        responsavelId: responsibleId,
        atualizadoEm: new Date(),
      })
      .where(eq(solicitacoes.id, requestId));

    return { success: true, data: { responsavelId: responsibleId } };
  } catch (error) {
    console.error("Error assigning responsible:", error);
    return { success: false, error: "Erro ao atribuir responsável" };
  }
}

export async function getAdminUsers() {
  try {
    const users = await db.query.adminUsers.findMany({
      where: eq(adminUsers.ativo, true),
      columns: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return { success: false, error: "Erro ao buscar usuários admin" };
  }
}
