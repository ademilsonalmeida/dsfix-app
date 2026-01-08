"use client";

import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo{session?.user?.name ? `, ${session.user.name}` : ""}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Solicitações Pendentes</h3>
            <p className="text-3xl font-bold text-blue-600">-</p>
            <p className="text-sm text-gray-500 mt-2">
              Implementado na Task 5
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Em Andamento</h3>
            <p className="text-3xl font-bold text-yellow-600">-</p>
            <p className="text-sm text-gray-500 mt-2">
              Implementado na Task 5
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Equipamentos Ativos</h3>
            <p className="text-3xl font-bold text-green-600">-</p>
            <p className="text-sm text-gray-500 mt-2">
              Implementado na Task 6
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Próximos Passos</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Task 1: Configuração do Projeto</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Task 2: Schema do Banco de Dados</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Task 3: Sistema de Autenticação</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Task 4: Fluxo de Solicitação de Colaboradores</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Task 5: Dashboard de Solicitações</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Task 6: Gestão de Equipamentos</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Task 7: Seed Data e Polish</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
