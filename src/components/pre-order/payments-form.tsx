"use client";

import Image from "next/image";

// Subcomponentes
import { PreOrderFindFullResponse } from "@/interfaces";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export function PaymentsForm({ preorder }: { preorder: PreOrderFindFullResponse }) {
 const router = useRouter();
 const [isLoading, setIsLoading] = useState<boolean>(false);

  const setStep = async (step:string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pre-sale/change-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preorderId: preorder.id, step: step }),
      });
      if (!response.ok) {
        setIsLoading(false);
        toast.error('Falha ao processar esta opção, tente novamente.');
        //router.push("/off-line");
      } else {
        setIsLoading(false);
        router.push(`/pre-venda/${preorder.id}/pagamento/${step}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Ocorreu um erro ao defiir opção pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-xl lg:text-2xl font-bold">Escolha o método de pagamento</h2>
          <p className="text-gray-600">Selecione uma das opções abaixo:</p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
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
