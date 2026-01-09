"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface QRScannerProps {
  onClose: () => void;
}

export function QRScanner({ onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  const handleQRCodeDetected = async (decodedText: string) => {
    try {
      // Stop scanner
      if (scannerRef.current) {
        await scannerRef.current.stop();
      }

      // Check if it's a URL or just a code
      if (decodedText.startsWith("http")) {
        // Extract equipment code from URL (e.g., https://dsfix.app/equipamentos/EQUIP-001)
        const match = decodedText.match(/\/equipamentos\/([^/?]+)/);
        if (match) {
          router.push(`/equipamentos/${match[1]}`);
        } else {
          // Unknown URL format
          setError("QR Code inválido para este sistema");
        }
      } else {
        // Assume it's a direct equipment code
        router.push(`/equipamentos/${decodedText}`);
      }
    } catch (err) {
      console.error("Error handling QR code:", err);
      setError("Erro ao processar QR Code");
    }
  };

  useEffect(() => {
    const startScanner = async () => {
      try {
        setIsScanning(true);
        setError(null);

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" }, // Prefer back camera on mobile
          {
            fps: 10, // Scan 10 times per second
            qrbox: { width: 250, height: 250 }, // Scanning box size
          },
          (decodedText) => {
            // QR code successfully decoded
            handleQRCodeDetected(decodedText);
          },
          () => {
            // Error callback - ignore scanning errors (too noisy)
          }
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
        setError(
          "Não foi possível acessar a câmera. Verifique as permissões."
        );
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch((err) => {
            console.error("Error stopping scanner:", err);
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-black text-white">
        <h2 className="text-xl font-semibold">Escanear QR Code</h2>
        <Button variant="ghost" onClick={handleClose} className="text-white">
          ✕ Fechar
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
            <Button onClick={handleClose} className="mt-4">
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <div
              id="qr-reader"
              className="w-full max-w-md rounded-lg overflow-hidden"
            />
            <div className="mt-6 bg-white bg-opacity-10 text-white px-6 py-4 rounded-lg max-w-md">
              <p className="text-sm text-center">
                📱 Posicione o QR Code dentro do quadrado
              </p>
              <p className="text-xs text-center mt-2 opacity-75">
                A leitura é automática quando o código for detectado
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
