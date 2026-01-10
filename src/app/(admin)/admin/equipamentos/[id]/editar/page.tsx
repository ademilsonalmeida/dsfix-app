"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentForm } from "@/components/forms/equipment-form";
import { getEquipamentoById } from "@/lib/actions/equipamentos";
import { toast } from "sonner";

interface PageProps {
  params: {
    id: string;
  };
}

interface Equipamento {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  local: string;
  observacoes?: string | null;
}

export default function EditarEquipamentoPage({ params }: PageProps) {
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEquipamento = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getEquipamentoById(params.id);
      if (result.success && result.data) {
        setEquipamento(result.data as Equipamento);
      } else {
        toast.error("Equipamento não encontrado");
      }
    } catch (error) {
      console.error("Error loading equipamento:", error);
      toast.error("Erro ao carregar equipamento");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadEquipamento();
  }, [loadEquipamento]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando equipamento...</p>
      </div>
    );
  }

  if (!equipamento) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Equipamento não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar Equipamento</h1>
          <p className="text-gray-600 mt-2">
            {equipamento.nome} - {equipamento.codigo}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Equipamento</CardTitle>
          </CardHeader>
          <CardContent>
            <EquipmentForm mode="edit" equipamento={equipamento} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
