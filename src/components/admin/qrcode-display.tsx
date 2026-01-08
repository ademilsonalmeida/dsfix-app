"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface QRCodeDisplayProps {
  equipamento: {
    codigo: string;
    nome: string;
    local: string;
  };
  baseUrl: string;
}

export function QRCodeDisplay({ equipamento, baseUrl }: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const equipmentUrl = baseUrl + "/equipamentos/" + equipamento.codigo;

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    // Convert SVG to PNG
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qrcode-" + equipamento.codigo + ".png";
        link.click();
        URL.revokeObjectURL(url);
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Screen view */}
      <div className="print:hidden space-y-6">
        <div className="bg-white p-8 rounded-lg border text-center">
          <div ref={qrRef} className="inline-block">
            <QRCodeSVG
              value={equipmentUrl}
              size={256}
              level="M"
              includeMargin={true}
            />
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="text-xl font-bold">{equipamento.nome}</h3>
            <p className="text-gray-600">{equipamento.local}</p>
            <p className="text-sm text-gray-500">Código: {equipamento.codigo}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleDownload} className="flex-1">
            Download PNG
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            Imprimir
          </Button>
        </div>
      </div>

      {/* Print view */}
      <div className="hidden print:block text-center p-8">
        <div className="inline-block border-4 border-black p-8">
          <QRCodeSVG
            value={equipmentUrl}
            size={400}
            level="M"
            includeMargin={true}
          />
          <div className="mt-6 space-y-2">
            <h3 className="text-2xl font-bold">{equipamento.nome}</h3>
            <p className="text-xl text-gray-700">{equipamento.local}</p>
            <p className="text-lg text-gray-600">Código: {equipamento.codigo}</p>
            <p className="text-sm text-gray-500 mt-4">
              Escaneie para reportar problemas de manutenção
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
