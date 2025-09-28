"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PaymentPixProps {
  preorderId: string;
}

export function PaymentPix({ preorderId }: PaymentPixProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<{
    qrCodeBase64: string;
    copyPaste: string;
  } | null>(null);

  useEffect(() => {
    const generatePix = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/pix`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preorderId }),
        });
        const data = await res.json();
        setPixData({
          qrCodeBase64: data.point_of_interaction.transaction_data.qr_code_base64,
          copyPaste: data.point_of_interaction.transaction_data.qr_code,
        });
      } catch (e) {
        toast({
          title: "Erro",
          description: "Falha ao gerar PIX.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    generatePix();
  }, [preorderId]);

  if (loading) {
    return <p className="text-gray-600">Gerando PIX, aguarde...</p>;
  }

  if (!pixData) {
    return <p className="text-red-500">Não foi possível gerar o PIX.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
        alt="QR Code PIX"
        width={220}
        height={220}
      />
      <Button
        onClick={() => navigator.clipboard.writeText(pixData.copyPaste)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Copiar Código PIX
      </Button>
    </div>
  );
}
