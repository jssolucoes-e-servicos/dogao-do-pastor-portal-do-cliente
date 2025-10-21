"use client";

import Image from "next/image";

// Subcomponentes
import { IOrderOnline } from "@/interfaces";
import { formatCurrency } from "@/lib/formats";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export function PaymentsForm({ preorder }: { preorder: IOrderOnline }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setStep = async (step:string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online/change-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preorderId: preorder.id, step: step }),
      });
      if (!response.ok) {
        
        toast.error('Falha ao processar esta opção, tente novamente.');
        setIsLoading(false);
      } else {
        
        router.push(`/comprar/${preorder.id}/pagamento/${step}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Ocorreu um erro ao defiir opção pagamento. Tente novamente.');
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
      <h2 className="text-xl lg:text-2xl font-bold text-center">Escolha o método de pagamento</h2>
      <div className="grid grid-cols-2 gap-6 w-full mx-auto max-w-md justify-center">
        
        {isLoading ? (<Label>Preparando metodo</Label>) : (<Fragment>
          <Button
            onClick={()=>{
              setStep('pix');
            }}
            className="flex flex-col rounded-md min-h-22 items-center justify-center gap-2 py-6 bg-green-600 hover:bg-green-700"
          >
            <Image src="/assets/images/pix.svg" alt="PIX" width={40} height={40} />
            <span className="font-bold text-xl">Pagar com PIX</span>
          </Button>

          <Button
            onClick={()=>{
              setStep('cartao');
            }}
            className="flex flex-col rounded-md min-h-22 items-center justify-center gap-2 py-6 bg-blue-600 hover:bg-blue-700"
          >
            <Image src="/assets/images/card.svg" alt="Cartão" width={40} height={40} />
            <span className="font-bold text-xl">Cartão de Crédito</span>
          </Button>
        </Fragment>)}
      </div>
    </div>
  );
}
