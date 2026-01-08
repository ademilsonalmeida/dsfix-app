import { getRequestById } from "@/lib/actions/requests";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ConfirmacaoPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getRequestById(id);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Solicitação Não Encontrada</h1>
            <p className="text-gray-600 mb-6">
              {result.error || "A solicitação não foi encontrada no sistema."}
            </p>
            <Link href="/solicitar">
              <Button>Nova Solicitação</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const request = result.data;

  const getUrgenciaStyle = (urgencia: string) => {
    if (urgencia === "ALTA") return "bg-red-100 text-red-800";
    if (urgencia === "MEDIA") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getUrgenciaLabel = (urgencia: string) => {
    if (urgencia === "ALTA") return "Alta";
    if (urgencia === "MEDIA") return "Média";
    return "Baixa";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="text-center mb-8">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-2">Solicitação Enviada!</h1>
            <p className="text-gray-600">
              Sua solicitação foi registrada com sucesso
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Número da Solicitação</p>
              <p className="text-3xl font-bold text-blue-600">{request.numero}</p>
              <p className="text-xs text-gray-500 mt-2">
                Guarde este número para referência futura
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Detalhes da Solicitação</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Equipamento</p>
                <p className="font-semibold">{request.equipamento?.nome}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Local</p>
                <p className="font-semibold">{request.equipamento?.local}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Solicitante</p>
                <p className="font-semibold">{request.solicitanteNome}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Departamento</p>
                <p className="font-semibold">{request.solicitanteDepartamento}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-1 text-sm">Urgência</p>
              <span
                className={"inline-block px-3 py-1 rounded-full text-sm font-semibold " + getUrgenciaStyle(request.urgencia)}
              >
                {getUrgenciaLabel(request.urgencia)}
              </span>
            </div>

            <div>
              <p className="text-gray-600 mb-1 text-sm">Descrição do Problema</p>
              <p className="bg-gray-50 p-3 rounded text-sm">{request.descricao}</p>
            </div>

            {request.fotoUrl && (
              <div>
                <p className="text-gray-600 mb-2 text-sm">Foto Anexada</p>
                <img
                  src={request.fotoUrl}
                  alt="Foto do problema"
                  className="max-w-md rounded border"
                />
              </div>
            )}

            <div>
              <p className="text-gray-600 mb-1 text-sm">Status</p>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {request.status}
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Próximos Passos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                <span>
                  Sua solicitação será analisada pela equipe de manutenção
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                <span>
                  Um técnico responsável será atribuído ao chamado
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                <span>
                  O reparo será realizado conforme a urgência e disponibilidade
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/solicitar" className="flex-1">
              <Button variant="outline" className="w-full">
                Nova Solicitação
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">Concluir</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
