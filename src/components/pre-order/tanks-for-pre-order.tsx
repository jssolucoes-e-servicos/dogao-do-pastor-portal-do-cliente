// components/pre-order/tanks-for-pre-order.tsx
'use client';

import { Button } from "@/components/ui/button";
import { PreOrderFindFullResponse } from "@/interfaces";
import { Fragment } from "react";

interface TanksForPreOrderProps {
  preorder: PreOrderFindFullResponse;
}

export function TanksForPreOrder({ preorder }: TanksForPreOrderProps) {
  const paymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <Fragment>
      <div className="max-w-3xl mx-auto my-12 p-6 bg-gray-900 rounded-xl shadow-lg text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Obrigado pela sua compra!</h1>

        <div className="bg-gray-800 p-4 rounded-md space-y-4">
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
            <span className="font-semibold">Pagamento:</span>{' '}
            <span className={paymentStatusColor(preorder.paymentStatus)}>
              {preorder.paymentStatus.toUpperCase()}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold">Forma de pagamento:</span>{' '}
            {preorder.paymentProvider || '-'}
          </p>
          {preorder.observations && (
            <p className="text-lg">
              <span className="font-semibold">Observações:</span> {preorder.observations}
            </p>
          )}
          {preorder.paymentUrl && preorder.paymentStatus.toLowerCase() === 'pending' && (
            <p className="text-lg">
              <span className="font-semibold">Finalize seu pagamento:</span>{' '}
              <a
                href={preorder.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 underline"
              >
                Clique aqui
              </a>
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => window.location.href = '/pre-venda?v=dogao'}
          >
            Comprar outro
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
