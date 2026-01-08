"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RequestFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    urgencia?: string;
    search?: string;
  }) => void;
}

export function RequestFilters({ onFilterChange }: RequestFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <Label htmlFor="status-filter">Status</Label>
        <Select
          id="status-filter"
          onChange={(e) =>
            onFilterChange({
              status: e.target.value || undefined,
            })
          }
        >
          <option value="">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em Andamento</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="CANCELADO">Cancelado</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="urgencia-filter">Urgência</Label>
        <Select
          id="urgencia-filter"
          onChange={(e) =>
            onFilterChange({
              urgencia: e.target.value || undefined,
            })
          }
        >
          <option value="">Todas</option>
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Média</option>
          <option value="BAIXA">Baixa</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          type="text"
          placeholder="Nome do solicitante ou número"
          onChange={(e) =>
            onFilterChange({
              search: e.target.value || undefined,
            })
          }
        />
      </div>
    </div>
  );
}
