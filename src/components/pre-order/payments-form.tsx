"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

// Subcomponentes
import { PreOrderFindFullResponse } from "@/interfaces";
import { PaymentCard } from "./payment-card";
import { PaymentPix } from "./payment-pix";

export function PaymentsForm({ preorder }: { preorder: PreOrderFindFullResponse }) {
  //const { toast } = useToast();
  const [method, setMethod] = useState<"PIX" | "CARD" | null>(null);

  if (method === "PIX") {
    return <PaymentPix preorder={preorder} />;
  }

  if (method === "CARD") {
    return <PaymentCard preorder={preorder} />;
  }

  // Tela inicial de escolha
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Escolha o método de pagamento</h2>
      <p className="text-gray-600">Selecione uma das opções abaixo:</p>

      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <Button
          onClick={() => setMethod("PIX")}
          className="flex flex-col items-center justify-center gap-2 py-6 bg-green-600 hover:bg-green-700"
        >
          <Image src="/assets/images/pix.svg" alt="PIX" width={40} height={40} />
          <span>Pagar com PIX</span>
        </Button>

        <Button
          onClick={() => setMethod("CARD")}
          className="flex flex-col items-center justify-center gap-2 py-6 bg-blue-600 hover:bg-blue-700"
        >
          <Image src="/assets/images/card.svg" alt="Cartão" width={40} height={40} />
          <span>Cartão de Crédito</span>
        </Button>
      </div>
    </div>
  );
}
