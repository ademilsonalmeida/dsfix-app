"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Sistema de Manutenção
          </h1>
          <p className="text-xl text-gray-600">
            Solicite manutenção de equipamentos de forma rápida e fácil
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📱</div>
              <h2 className="text-2xl font-semibold mb-2">Escaneie o QR Code</h2>
              <p className="text-gray-600">
                Use a câmera do seu celular para escanear o QR Code colado no equipamento
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded text-sm text-gray-700">
              <p className="font-semibold mb-2">Como fazer:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Abra a câmera do celular</li>
                <li>Aponte para o QR Code do equipamento</li>
                <li>Toque na notificação que aparecer</li>
                <li>Preencha o formulário</li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-2">Pesquise o Equipamento</h2>
              <p className="text-gray-600">
                Se o QR Code não estiver disponível, pesquise pelo nome ou localização
              </p>
            </div>
            <Link href="/solicitar">
              <Button className="w-full" size="lg">
                Iniciar Pesquisa
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Informações Importantes
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold mb-1">Rápido</h4>
              <p className="text-gray-600">
                Solicitação em menos de 2 minutos
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📋</div>
              <h4 className="font-semibold mb-1">Organizado</h4>
              <p className="text-gray-600">
                Receba número de confirmação
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔧</div>
              <h4 className="font-semibold mb-1">Eficiente</h4>
              <p className="text-gray-600">
                Equipe atende por prioridade
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Acesso administrativo:{" "}
            <Link href="/admin" className="text-blue-600 hover:underline">
              Dashboard Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
