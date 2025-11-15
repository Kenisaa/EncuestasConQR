"use client";

import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

export function QRCodeDisplay({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code generation using API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);
    };
    img.src = qrApiUrl;
  }, [url]);

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'encuesta-qr.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="border rounded-lg p-4 bg-white">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>
      <Button onClick={downloadQR} variant="outline" className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Descargar Código QR
      </Button>
    </div>
  );
}
