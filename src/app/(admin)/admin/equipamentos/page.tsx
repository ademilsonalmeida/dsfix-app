"use client";

import { useEffect, useState, useCallback } from "react";
import { EquipmentList } from "@/components/admin/equipment-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { listAllEquipamentos, deactivateEquipamento } from "@/lib/actions/equipamentos";
import { toast } from "sonner";

interface Equipment {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  local: string;
  ativo: boolean;
  criadoEm: Date;
}

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipment[]>([]);
  const [filteredEquipamentos, setFilteredEquipamentos] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const loadEquipamentos = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listAllEquipamentos(showInactive);
      if (result.success && result.data) {
        setEquipamentos(result.data as Equipment[]);
      }
    } catch (error) {
      console.error("Error loading equipamentos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [showInactive]);

  const filterEquipamentos = useCallback(() => {
    if (!searchTerm) {
      setFilteredEquipamentos(equipamentos);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = equipamentos.filter(
      (eq) =>
        eq.nome.toLowerCase().includes(searchLower) ||
        eq.codigo.toLowerCase().includes(searchLower) ||
        eq.categoria.toLowerCase().includes(searchLower) ||
        eq.local.toLowerCase().includes(searchLower)
    );
    setFilteredEquipamentos(filtered);
  }, [equipamentos, searchTerm]);

  useEffect(() => {
    loadEquipamentos();
  }, [loadEquipamentos]);

  useEffect(() => {
    filterEquipamentos();
  }, [filterEquipamentos]);

  const handleDeactivate = async (id: string) => {
    try {
      const result = await deactivateEquipamento(id);
      if (result.success) {
        toast.success("Equipamento desativado com sucesso!");
        await loadEquipamentos(); // Reload the list to reflect changes
      } else {
        toast.error("Erro ao desativar: " + result.error);
      }
    } catch (error) {
      console.error("Error deactivating:", error);
      toast.error("Erro ao desativar equipamento");
    }
  };

  const stats = {
    total: equipamentos.length,
    ativos: equipamentos.filter((e) => e.ativo).length,
    inativos: equipamentos.filter((e) => !e.ativo).length,
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Equipamentos</h1>
            <p className="text-gray-600 mt-2">
              Cadastre equipamentos e gere QR Codes
            </p>
          </div>
          <Link href="/admin/equipamentos/novo">
            <Button>Novo Equipamento</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total de Equipamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipamentos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.ativos}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipamentos Inativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-500">{stats.inativos}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buscar e Filtrar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                type="text"
                placeholder="Nome, código, categoria ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="showInactive" className="cursor-pointer">
                Mostrar equipamentos inativos
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Equipment List */}
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Carregando equipamentos...</p>
              </div>
            ) : (
              <EquipmentList
                equipamentos={filteredEquipamentos}
                onDeactivate={handleDeactivate}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
