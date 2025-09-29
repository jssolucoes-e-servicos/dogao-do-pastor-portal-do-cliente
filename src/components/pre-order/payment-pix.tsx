"use client";

import { Button } from "@/components/ui/button";
import { PreOrderFindFullResponse } from "@/interfaces";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function PaymentPix({ preorder }: { preorder: PreOrderFindFullResponse }) {
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<{
    qrCodeBase64: string;
    copyPaste: string;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    const generatePix = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/pix`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preorderId: preorder.id }),
          }
        );

        if (!res.ok) throw new Error("Erro ao gerar PIX");

        const data = await res.json();
        setPixData({
          qrCodeBase64: data.payment.pix.qrCodeBase64,
          copyPaste: data.payment.pix.qrCode || "",
        });
      } catch (e) {
        console.error(e);
        toast.error("Falha ao gerar PIX.");
      } finally {
        setLoading(false);
      }
    };

    generatePix();
  }, [preorder.id]);

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
