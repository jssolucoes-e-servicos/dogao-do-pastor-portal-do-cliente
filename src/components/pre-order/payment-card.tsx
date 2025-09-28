"use client";

import { useToast } from "@/components/ui/use-toast";
import { PreOrderFindResponse } from "@/interfaces";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

interface PaymentCardProps {
  preorder: PreOrderFindResponse;
}

export function PaymentCard({ preorder }: PaymentCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Inicializa o SDK do MercadoPago
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
      initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, {
        locale: "pt-BR",
      });
    }
  }, []);

  const handleSubmit = async (token: string, installments: number) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/${preorder.id}/card`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            card: {
              token,
              installments,
            },
            payer: {
              firstName: preorder.customer.name,
              phone: preorder.customer.phone,
              email: preorder.customer.email || undefined,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao processar pagamento");

      toast({
        title: "Sucesso",
        description: "Pagamento processado com sucesso!",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível processar o pagamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md w-full">
      <CardPayment
        initialization={{ amount: preorder.valueTotal }}
        onSubmit={async ({ token, installments }) => {
          await handleSubmit(token, installments);
        }}
      />

      {loading && (
        <p className="text-sm text-gray-500">Processando pagamento...</p>
      )}
    </div>
  );
}
