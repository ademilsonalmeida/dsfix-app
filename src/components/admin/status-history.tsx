"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StatusHistoryProps {
  historico: Array<{
    id: string;
    statusAnterior: string | null;
    statusNovo: string;
    observacao: string | null;
    criadoEm: Date;
    alteradoPor?: {
      nome: string;
    } | null;
  }>;
}

export function StatusHistory({ historico }: StatusHistoryProps) {
  return (
    <div className="space-y-4">
      {historico.map((item, index) => (
        <div key={item.id} className="flex gap-4 relative">
          {/* Timeline connector */}
          {index < historico.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200" />
          )}
          
          {/* Timeline dot */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold z-10">
            {index + 1}
          </div>
          
          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-sm">
                    {item.statusAnterior ? (
                      <>
                        {item.statusAnterior.replace("_", " ")} → {item.statusNovo.replace("_", " ")}
                      </>
                    ) : (
                      <>{item.statusNovo.replace("_", " ")}</>
                    )}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(item.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </span>
              </div>
              
              {item.alteradoPor && (
                <p className="text-xs text-gray-600 mb-1">
                  Por: {item.alteradoPor.nome}
                </p>
              )}
              
              {item.observacao && (
                <p className="text-sm text-gray-700 mt-2 italic">
                  &ldquo;{item.observacao}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
