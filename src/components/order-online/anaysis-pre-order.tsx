import { PreOrderFindFullResponse } from "@/interfaces";
import { Fragment } from "react";

interface AnalysisPreOrderProps {
  preorder: PreOrderFindFullResponse;
}

export async function AnalysisPreOrder({ preorder }: AnalysisPreOrderProps) {
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <Fragment>
      <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Seu pedido esta em análise</h1>

        <div className="bg-gray-100 p-4 rounded-md space-y-4">
          <p className="text-lg">
            <span className="font-semibold">Cliente:</span> {preorder.customer?.name || 'Cliente'}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Quantidade:</span> {preorder.quantity}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Total:</span> {formatCurrency(preorder.valueTotal)}
          </p>
         
         
          <p className="text-lg">
            <span className="font-semibold">Opção de entrega:</span> 
            {preorder.deliveryOption === 'delivery' && ' Entrega'}
          
          </p>
          
        </div>
      </div>
    </Fragment>
  );
}
