"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/admin/qrcode-display";
import { getEquipamentoById } from "@/lib/actions/equipamentos";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
  local: string;
}

export default function QRCodePage({ params }: PageProps) {
  const router = useRouter();
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState("");

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
    // Get base URL from browser
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-3xl font-bold">QR Code</h1>
            <p className="text-gray-600 mt-2">
              {equipamento.nome}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
        </div>

        <Card className="print:shadow-none print:border-0">
          <CardHeader className="print:hidden">
            <CardTitle>QR Code do Equipamento</CardTitle>
          </CardHeader>
          <CardContent>
            <QRCodeDisplay equipamento={equipamento} baseUrl={baseUrl} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
