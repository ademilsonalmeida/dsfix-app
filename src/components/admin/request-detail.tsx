"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusHistory } from "./status-history";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { updateRequestStatus, assignResponsible } from "@/lib/actions/requests";
import { useSession } from "next-auth/react";

interface RequestDetailProps {
  request: {
    id: string;
    numero: string;
    solicitanteNome: string;
    solicitanteDepartamento: string;
    descricao: string;
    urgencia: string;
    status: string;
    fotoUrl?: string | null;
    criadoEm: Date;
    equipamento?: {
      nome: string;
      codigo: string;
      local: string;
    } | null;
    responsavel?: {
      id: string;
      nome: string;
    } | null;
    historico?: Array<{
      id: string;
      statusAnterior: string | null;
      statusNovo: string;
      observacao: string | null;
      criadoEm: Date;
      alteradoPor?: {
        nome: string;
      } | null;
    }>;
  };
  adminUsers: Array<{
    id: string;
    nome: string;
  }>;
  onClose: () => void;
  onUpdate: () => void;
}

export function RequestDetail({ request, adminUsers, onClose, onUpdate }: RequestDetailProps) {
  const { data: session } = useSession();
  const [newStatus, setNewStatus] = useState(request.status);
  const [observation, setObservation] = useState("");
  const [responsibleId, setResponsibleId] = useState(request.responsavel?.id || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (newStatus === request.status) return;
    
    setIsUpdating(true);
    try {
      const result = await updateRequestStatus(
        request.id,
        newStatus,
        session?.user?.id,
        observation || undefined
      );
      
      if (result.success) {
        alert("Status atualizado com sucesso!");
        onUpdate();
      } else {
        alert("Erro ao atualizar status: " + result.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResponsibleUpdate = async (newResponsibleId: string) => {
    setIsUpdating(true);
    try {
      const result = await assignResponsible(request.id, newResponsibleId || null);
      
      if (result.success) {
        alert("Responsável atualizado com sucesso!");
        setResponsibleId(newResponsibleId);
        onUpdate();
      } else {
        alert("Erro ao atribuir responsável: " + result.error);
      }
    } catch (error) {
      console.error("Error assigning responsible:", error);
      alert("Erro ao atribuir responsável");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Detalhes da Solicitação</h2>
            <p className="text-gray-600">{request.numero}</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações do Solicitante */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Solicitante</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <p className="text-sm font-medium">{request.solicitanteNome}</p>
              </div>
              <div>
                <Label>Departamento</Label>
                <p className="text-sm font-medium">{request.solicitanteDepartamento}</p>
              </div>
              <div>
                <Label>Data da Solicitação</Label>
                <p className="text-sm font-medium">
                  {format(new Date(request.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <Label>Urgência</Label>
                <p className="text-sm font-medium">{request.urgencia}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Equipamento */}
          <Card>
            <CardHeader>
              <CardTitle>Equipamento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <p className="text-sm font-medium">{request.equipamento?.nome || "-"}</p>
              </div>
              <div>
                <Label>Código</Label>
                <p className="text-sm font-medium">{request.equipamento?.codigo || "-"}</p>
              </div>
              <div className="col-span-2">
                <Label>Local</Label>
                <p className="text-sm font-medium">{request.equipamento?.local || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Descrição do Problema */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição do Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{request.descricao}</p>
            </CardContent>
          </Card>

          {/* Foto (se houver) */}
          {request.fotoUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Foto do Problema</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={request.fotoUrl}
                  alt="Foto do problema"
                  className="max-w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {/* Gerenciamento */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="responsible">Responsável</Label>
                <Select
                  id="responsible"
                  value={responsibleId}
                  onChange={(e) => handleResponsibleUpdate(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="">Não atribuído</option>
                  {adminUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nome}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="CANCELADO">Cancelado</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="observation">Observação (opcional)</Label>
                <Textarea
                  id="observation"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Adicione uma observação sobre a mudança de status..."
                  disabled={isUpdating}
                />
              </div>

              <Button
                onClick={handleStatusUpdate}
                disabled={newStatus === request.status || isUpdating}
                className="w-full"
              >
                {isUpdating ? "Atualizando..." : "Atualizar Status"}
              </Button>
            </CardContent>
          </Card>

          {/* Histórico de Status */}
          {request.historico && request.historico.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Status</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusHistory historico={request.historico} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
