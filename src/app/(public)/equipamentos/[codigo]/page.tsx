import { getEquipamentoByCodigo } from "@/lib/actions/equipamentos";
import RequestForm from "@/components/forms/request-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    codigo: string;
  }>;
}

export default async function EquipamentoPage({ params }: PageProps) {
  const { codigo } = await params;
  const result = await getEquipamentoByCodigo(codigo);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Equipamento Não Encontrado</h1>
            <p className="text-gray-600 mb-6">
              {result.error || "O código do equipamento não foi encontrado no sistema."}
            </p>
            <Link href="/solicitar">
              <Button>Pesquisar Equipamento</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const equipamento = result.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Solicitar Manutenção</h1>
          <p className="text-gray-600">
            Equipamento identificado via QR Code
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <RequestForm equipamento={equipamento} />
        </div>

        <div className="mt-6 text-center">
          <Link href="/solicitar" className="text-blue-600 hover:underline">
            Pesquisar outro equipamento
          </Link>
        </div>
      </div>
    </div>
  );
}
