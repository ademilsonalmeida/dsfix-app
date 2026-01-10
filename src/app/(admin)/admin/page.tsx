"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { RequestsList } from "@/components/admin/requests-list";
import { RequestFilters } from "@/components/admin/request-filters";
import { RequestDetail } from "@/components/admin/request-detail";
import { getRequests, getRequestDetail, getAdminUsers, type RequestFilters as Filters } from "@/lib/actions/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Request {
  id: string;
  numero: string;
  solicitanteNome: string;
  solicitanteDepartamento: string;
  descricao: string;
  urgencia: string;
  status: string;
  criadoEm: Date;
  equipamento?: { nome: string; codigo: string; local: string } | null;
  responsavel?: { id: string; nome: string } | null;
}

interface AdminUser {
  id: string;
  nome: string;
  email: string;
}

interface RequestDetail {
  id: string;
  numero: string;
  solicitanteNome: string;
  solicitanteDepartamento: string;
  descricao: string;
  urgencia: string;
  status: string;
  fotoUrl?: string | null;
  criadoEm: Date;
  equipamento?: { nome: string; codigo: string; local: string } | null;
  responsavel?: { id: string; nome: string } | null;
  historico?: Array<{
    id: string;
    statusAnterior: string | null;
    statusNovo: string;
    observacao: string | null;
    criadoEm: Date;
    alteradoPor?: { nome: string } | null;
  }>;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});
  
  // Stats
  const [stats, setStats] = useState({
    pendente: 0,
    emAndamento: 0,
    total: 0,
  });

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const result = await getRequests();
      if (result.success && result.data) {
        setRequests(result.data as Request[]);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const result = await getAdminUsers();
      if (result.success && result.data) {
        setAdminUsers(result.data as AdminUser[]);
      }
    } catch (error) {
      console.error("Error loading admin users:", error);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...requests];

    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    if (filters.urgencia) {
      filtered = filtered.filter((r) => r.urgencia === filters.urgencia);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.solicitanteNome.toLowerCase().includes(searchLower) ||
          r.numero.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, filters]);

  const calculateStats = useCallback(() => {
    const pendente = filteredRequests.filter((r) => r.status === "PENDENTE").length;
    const emAndamento = filteredRequests.filter((r) => r.status === "EM_ANDAMENTO").length;
    setStats({
      pendente,
      emAndamento,
      total: filteredRequests.length,
    });
  }, [filteredRequests]);

  useEffect(() => {
    loadRequests();
    loadAdminUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleRequestClick = async (id: string) => {
    try {
      const result = await getRequestDetail(id);
      if (result.success && result.data) {
        setSelectedRequest(result.data as RequestDetail);
      }
    } catch (error) {
      console.error("Error loading request detail:", error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
  };

  const handleUpdate = () => {
    loadRequests();
    handleCloseDetail();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo{session?.user?.name ? `, ${session.user.name}` : ""}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Solicitações Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.pendente}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{stats.emAndamento}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total de Solicitações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/equipamentos">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">📦</span>
                  <span className="font-semibold">Gerenciar Equipamentos</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestFilters onFilterChange={handleFilterChange} />
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Carregando solicitações...</p>
              </div>
            ) : (
              <RequestsList
                requests={filteredRequests}
                onRequestClick={handleRequestClick}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetail
          request={selectedRequest}
          adminUsers={adminUsers}
          onClose={handleCloseDetail}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
