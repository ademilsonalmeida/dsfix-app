"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Request {
  id: string;
  numero: string;
  solicitanteNome: string;
  solicitanteDepartamento: string;
  descricao: string;
  urgencia: string;
  status: string;
  criadoEm: Date;
  equipamento?: {
    nome: string;
  } | null;
  responsavel?: {
    nome: string;
  } | null;
}

interface RequestsListProps {
  requests: Request[];
  onRequestClick: (id: string) => void;
}

export function RequestsList({ requests, onRequestClick }: RequestsListProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      PENDENTE: "bg-blue-100 text-blue-800 border-blue-300",
      EM_ANDAMENTO: "bg-yellow-100 text-yellow-800 border-yellow-300",
      FINALIZADO: "bg-green-100 text-green-800 border-green-300",
      CANCELADO: "bg-red-100 text-red-800 border-red-300",
    };

    const colorClass = colors[status as keyof typeof colors] || colors.PENDENTE;
    return (
      <span className={"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold " + colorClass}>
        {status.replace("_", " ")}
      </span>
    );
  };

  const getUrgenciaBadge = (urgencia: string) => {
    const colors = {
      ALTA: "bg-red-100 text-red-800 border-red-300",
      MEDIA: "bg-orange-100 text-orange-800 border-orange-300",
      BAIXA: "bg-gray-100 text-gray-800 border-gray-300",
    };

    const colorClass = colors[urgencia as keyof typeof colors] || colors.MEDIA;
    return (
      <span className={"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold " + colorClass}>
        {urgencia}
      </span>
    );
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Nenhuma solicitação encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Solicitante
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Equipamento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Urgência
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Responsável
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {request.numero}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{request.solicitanteNome}</div>
                  <div className="text-gray-500">{request.solicitanteDepartamento}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.equipamento?.nome || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {getUrgenciaBadge(request.urgencia)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {getStatusBadge(request.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.responsavel?.nome || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(request.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRequestClick(request.id)}
                >
                  Ver Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
