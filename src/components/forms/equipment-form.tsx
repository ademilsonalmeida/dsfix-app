"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEquipamento, updateEquipamento } from "@/lib/actions/equipamentos";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EquipmentFormProps {
  equipamento?: {
    id: string;
    codigo: string;
    nome: string;
    categoria: string;
    local: string;
    observacoes?: string | null;
  };
  mode: "create" | "edit";
}

export function EquipmentForm({ equipamento, mode }: EquipmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    codigo: equipamento?.codigo || "",
    nome: equipamento?.nome || "",
    categoria: equipamento?.categoria || "",
    local: equipamento?.local || "",
    observacoes: equipamento?.observacoes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      
      if (mode === "create") {
        result = await createEquipamento(formData);
      } else {
        result = await updateEquipamento({
          id: equipamento!.id,
          ...formData,
        });
      }

      if (result.success) {
        toast.success(mode === "create" ? "Equipamento criado com sucesso!" : "Equipamento atualizado com sucesso!");
        router.push("/admin/equipamentos");
        router.refresh();
      } else {
        toast.error("Erro: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao salvar equipamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="codigo">Código *</Label>
        <Input
          id="codigo"
          type="text"
          value={formData.codigo}
          onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
          required
          maxLength={20}
          placeholder="ex: EQ001"
          disabled={isSubmitting}
        />
        <p className="text-sm text-gray-500 mt-1">
          Código único do equipamento (será usado no QR Code)
        </p>
      </div>

      <div>
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
          maxLength={100}
          placeholder="ex: Máquina de Café - Recepção"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="categoria">Categoria *</Label>
        <Input
          id="categoria"
          type="text"
          value={formData.categoria}
          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          required
          maxLength={50}
          placeholder="ex: Máquina de Café, Impressora, Ar Condicionado"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="local">Local *</Label>
        <Input
          id="local"
          type="text"
          value={formData.local}
          onChange={(e) => setFormData({ ...formData, local: e.target.value })}
          required
          maxLength={100}
          placeholder="ex: Recepção - 1º Andar"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          placeholder="Informações adicionais sobre o equipamento (opcional)"
          disabled={isSubmitting}
          rows={4}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Salvando..." : mode === "create" ? "Criar Equipamento" : "Salvar Alterações"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
