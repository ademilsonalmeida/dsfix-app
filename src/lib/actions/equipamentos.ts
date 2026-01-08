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
