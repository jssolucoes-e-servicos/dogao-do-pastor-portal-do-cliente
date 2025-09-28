"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface PaymentCardProps {
  preorderId: string;
}

export function PaymentCard({ preorderId }: PaymentCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui futuramente chamamos o SDK MP para gerar o card_token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preorderId,
          cardToken: "tokengeradoMP",
        }),
      });

      if (!response.ok) throw new Error("Erro ao processar pagamento");

      toast({ title: "Sucesso", description: "Pagamento processado com sucesso!" });
    } catch (err) {
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
    <form onSubmit={handlePayment} className="space-y-4 max-w-md w-full">
      <div>
        <Label>Número do Cartão</Label>
        <Input type="text" placeholder="0000 0000 0000 0000" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Validade</Label>
          <Input type="text" placeholder="MM/AA" required />
        </div>
        <div>
          <Label>CVV</Label>
          <Input type="text" placeholder="123" required />
        </div>
      </div>
      <div>
        <Label>Nome no Cartão</Label>
        <Input type="text" placeholder="Nome completo" required />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading ? "Processando..." : "Pagar"}
      </Button>
    </form>
  );
}
