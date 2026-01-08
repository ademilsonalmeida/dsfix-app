"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchEquipamentos } from "@/lib/actions/equipamentos";
import RequestForm from "@/components/forms/request-form";
import type { Equipamento } from "@/types/database";

export default function SolicitarPage() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Equipamento[]>([]);
  const [selectedEquipamento, setSelectedEquipamento] = useState<Equipamento | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError("Digite algo para pesquisar");
      return;
    }

    setSearching(true);
    setError("");
    setSelectedEquipamento(null);

    try {
      const result = await searchEquipamentos(query);

      if (result.success && result.data) {
        setResults(result.data);
        if (result.data.length === 0) {
          setError("Nenhum equipamento encontrado");
        }
      } else {
        setError(result.error || "Erro ao pesquisar equipamentos");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Erro ao pesquisar equipamentos");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Solicitar Manutenção</h1>
          <p className="text-gray-600">
            Pesquise o equipamento e descreva o problema
          </p>
        </div>

        {!selectedEquipamento ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="search">Pesquisar Equipamento</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="search"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Digite nome, código, local ou categoria..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={searching}>
                      {searching ? "Pesquisando..." : "Pesquisar"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Ex: &quot;Ar Condicionado&quot;, &quot;Sala 02&quot;, &quot;EQ-001&quot;
                  </p>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {results.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Resultados ({results.length})
                </h2>
                <div className="grid gap-4">
                  {results.map((equipamento) => (
                    <div
                      key={equipamento.id}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => setSelectedEquipamento(equipamento)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {equipamento.nome}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {equipamento.codigo}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Local:</strong> {equipamento.local}
                        </p>
                        <p>
                          <strong>Categoria:</strong> {equipamento.categoria}
                        </p>
                        {equipamento.observacoes && (
                          <p className="text-gray-500">
                            {equipamento.observacoes}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" className="w-full mt-3">
                        Selecionar Equipamento
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setSelectedEquipamento(null)}
                className="mb-4"
              >
                ← Voltar para pesquisa
              </Button>
              <h2 className="text-2xl font-semibold">Nova Solicitação</h2>
            </div>
            <RequestForm equipamento={selectedEquipamento} />
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
