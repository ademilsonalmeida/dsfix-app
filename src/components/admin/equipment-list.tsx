"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Equipment {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  local: string;
  ativo: boolean;
  criadoEm: Date;
}

interface EquipmentListProps {
  equipamentos: Equipment[];
  onDeactivate: (id: string) => void;
}

export function EquipmentList({ equipamentos, onDeactivate }: EquipmentListProps) {
  if (equipamentos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Nenhum equipamento encontrado</p>
        <Link href="/admin/equipamentos/novo">
          <Button className="mt-4">Cadastrar Primeiro Equipamento</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Local
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {equipamentos.map((equipamento) => (
            <tr key={equipamento.id} className={equipamento.ativo ? "hover:bg-gray-50" : "bg-gray-100"}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {equipamento.codigo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {equipamento.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {equipamento.categoria}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {equipamento.local}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {equipamento.ativo ? (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-300">
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border-gray-300">
                    Inativo
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Link href={"/admin/equipamentos/" + equipamento.id + "/qrcode"}>
                  <Button variant="outline" size="sm">
                    QR Code
                  </Button>
                </Link>
                <Link href={"/admin/equipamentos/" + equipamento.id + "/editar"}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
                {equipamento.ativo && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja desativar este equipamento?")) {
                        onDeactivate(equipamento.id);
                      }
                    }}
                  >
                    Desativar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
