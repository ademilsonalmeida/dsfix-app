"use server";

import { db } from "@/lib/db";
import { equipamentos } from "@/lib/db/schema";
import { eq, or, ilike } from "drizzle-orm";

export async function searchEquipamentos(query: string) {
  try {
    if (!query || query.trim().length < 2) {
      return { success: true, data: [] };
    }

    const searchTerm = "%" + query.trim() + "%";

    const results = await db
      .select()
      .from(equipamentos)
      .where(
        or(
          ilike(equipamentos.nome, searchTerm),
          ilike(equipamentos.codigo, searchTerm),
          ilike(equipamentos.local, searchTerm),
          ilike(equipamentos.categoria, searchTerm)
        )
      )
      .limit(10);

    return { success: true, data: results.filter((e) => e.ativo) };
  } catch (error) {
    console.error("Error searching equipamentos:", error);
    return { success: false, error: "Erro ao buscar equipamentos", data: [] };
  }
}

export async function getEquipamentoByCodigo(codigo: string) {
  try {
    const equipamento = await db.query.equipamentos.findFirst({
      where: eq(equipamentos.codigo, codigo),
    });

    if (!equipamento) {
      return { success: false, error: "Equipamento não encontrado" };
    }

    if (!equipamento.ativo) {
      return { success: false, error: "Equipamento inativo" };
    }

    return { success: true, data: equipamento };
  } catch (error) {
    console.error("Error getting equipamento:", error);
    return { success: false, error: "Erro ao buscar equipamento" };
  }
}

// Admin Equipment Management

export async function listAllEquipamentos(includeInactive = false) {
  try {
    const results = await db.query.equipamentos.findMany({
      where: includeInactive ? undefined : eq(equipamentos.ativo, true),
      orderBy: (equipamentos, { asc }) => [asc(equipamentos.nome)],
    });

    return { success: true, data: results };
  } catch (error) {
    console.error("Error listing equipamentos:", error);
    return { success: false, error: "Erro ao listar equipamentos" };
  }
}

export async function getEquipamentoById(id: string) {
  try {
    const equipamento = await db.query.equipamentos.findFirst({
      where: eq(equipamentos.id, id),
    });

    if (!equipamento) {
      return { success: false, error: "Equipamento não encontrado" };
    }

    return { success: true, data: equipamento };
  } catch (error) {
    console.error("Error getting equipamento:", error);
    return { success: false, error: "Erro ao buscar equipamento" };
  }
}

export interface CreateEquipamentoData {
  codigo: string;
  nome: string;
  categoria: string;
  local: string;
  observacoes?: string;
}

export async function createEquipamento(data: CreateEquipamentoData) {
  try {
    // Check if codigo already exists
    const existing = await db.query.equipamentos.findFirst({
      where: eq(equipamentos.codigo, data.codigo),
    });

    if (existing) {
      return { success: false, error: "Código já existe" };
    }

    const [newEquipamento] = await db
      .insert(equipamentos)
      .values({
        codigo: data.codigo,
        nome: data.nome,
        categoria: data.categoria,
        local: data.local,
        observacoes: data.observacoes || null,
        ativo: true,
      })
      .returning();

    return { success: true, data: newEquipamento };
  } catch (error) {
    console.error("Error creating equipamento:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao criar equipamento" };
  }
}

export interface UpdateEquipamentoData {
  id: string;
  codigo?: string;
  nome?: string;
  categoria?: string;
  local?: string;
  observacoes?: string;
}

export async function updateEquipamento(data: UpdateEquipamentoData) {
  try {
    // Check if equipment exists
    const existing = await db.query.equipamentos.findFirst({
      where: eq(equipamentos.id, data.id),
    });

    if (!existing) {
      return { success: false, error: "Equipamento não encontrado" };
    }

    // If codigo is being changed, check for duplicates
    if (data.codigo && data.codigo !== existing.codigo) {
      const duplicate = await db.query.equipamentos.findFirst({
        where: eq(equipamentos.codigo, data.codigo),
      });

      if (duplicate) {
        return { success: false, error: "Código já existe" };
      }
    }

    const updateData: Record<string, unknown> = {
      atualizadoEm: new Date(),
    };

    if (data.codigo) updateData.codigo = data.codigo;
    if (data.nome) updateData.nome = data.nome;
    if (data.categoria) updateData.categoria = data.categoria;
    if (data.local) updateData.local = data.local;
    if (data.observacoes !== undefined) updateData.observacoes = data.observacoes || null;

    const [updated] = await db
      .update(equipamentos)
      .set(updateData)
      .where(eq(equipamentos.id, data.id))
      .returning();

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating equipamento:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erro ao atualizar equipamento" };
  }
}

export async function deactivateEquipamento(id: string) {
  try {
    const [updated] = await db
      .update(equipamentos)
      .set({
        ativo: false,
        atualizadoEm: new Date(),
      })
      .where(eq(equipamentos.id, id))
      .returning();

    if (!updated) {
      return { success: false, error: "Equipamento não encontrado" };
    }

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error deactivating equipamento:", error);
    return { success: false, error: "Erro ao desativar equipamento" };
  }
}
