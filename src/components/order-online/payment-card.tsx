"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PreOrderFindFullResponse } from "@/interfaces";
import { formatCurrency } from "@/lib/formats";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

interface PaymentCardProps {
  preorder: PreOrderFindFullResponse;
}

export function PaymentCard({ preorder }: PaymentCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [textLoading, setTextLoading] = useState<string>("Inicializando");

  // Inicializa o SDK do MercadoPago
  useEffect(() => {
    setIsLoading(true);
    setTextLoading('Inicializando');
    if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
      initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, {
        locale: "pt-BR",
      });
    }
     setIsLoading(false);
  }, []);

  const handleSubmit = async (token: string, installments: number) => {
    try {
     setIsLoading(true);
      setTextLoading('Processando pagamento');

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

      if (!response.ok){ throw new Error("Erro ao processar pagamento");}else{
        toast.success("Pagamento processado com sucesso!");
        router.push(`/comprar/${preorder.id}/obrigado`);
      }

      

    } catch (err) {
      console.error(err);
      toast.error("Não foi possível processar o pagamento.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async () =>{
      setIsLoading(true);
      setTextLoading('Alterando forma de pagamento');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online/change-step`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ preorderId: preorder.id, step: 'payment' }),
        });
        if (!response.ok) {
          setIsLoading(false);
          toast.error('Falha ao processar esta opção, tente novamente.');
          //router.push("/off-line");
        } else {
          setIsLoading(false);
          router.push(`/comprar/${preorder.id}/pagamento`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        toast.error('Ocorreu um erro ao defiir opção pagamento. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }

  return (
    <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
      <h2 className="text-2xl font-bold text-center">Seu Pedido</h2>
      <div className=" p-4 bg-gray-100 rounded-md">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total ({preorder.quantity} Dogões):</span>
          <span>{formatCurrency(preorder.valueTotal)}</span>
        </div>
      </div>
      <h2 className="text-xl lg:text-2xl font-bold text-center">Pagamento com Cartão
        <Button 
          onClick={handleChange}
          variant="link" 
          className="pl-4 right-0 text-sm text-gray-500 hover:text-orange-600 h-auto"
        >
          ( Alterar pagamento )
        </Button>
      </h2>
      <div className="flex justify-center w-full max-w-md"> 
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8 w-full">
              <Loader2 className="h-10 w-10 animate-spin text-orange-600" /> {/* O spinner */}
              <Label className="text-gray-600">{textLoading}</Label>
          </div>
        ) : (
          <Fragment>
          <CardPayment
            initialization={{ amount: preorder.valueTotal }}
            onSubmit={async ({ token, installments }) => {
              await handleSubmit(token, installments);
            }}
          />

        </Fragment>
      )}
    </div>
    </div>
  );
}
