import { PaymentStatusEnum } from "@/enums";
import { PreOrderFindFullResponse } from "@/interfaces";
import Link from "next/link";
import { Fragment } from "react";

interface TanksForPreOrderProps {
  preorder: PreOrderFindFullResponse;
}

export async function TanksForPreOrder({ preorder }: TanksForPreOrderProps) {

  console.log(preorder)

  const paymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className='text-green-600'>Aprovado</span>;
      case 'pending':
        return <span className='text-yellow-600'>Pagamento Pendente</span>;
      case 'failed':
        return <span className='text-red-600'>Rejeitao</span>;
      default:
        return <span className='text--gray-600'>Pagamento Pendente</span>;
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
            {paymentStatusColor(preorder.paymentStatus)}
            
          </p>
          <p className="text-lg">
            <span className="font-semibold">Forma de pagamento:</span>{' '}
            {preorder.paymentMethod && preorder.paymentMethod === 'card' ? 'Cartão' : 'PIX'}
          </p>
          {preorder.observations && (
            <p className="text-lg">
              <span className="font-semibold">Observações:</span> {preorder.observations}
            </p>
          )}
          {preorder.paymentStatus.toLowerCase() === PaymentStatusEnum.pending ? (
            <Fragment>
            <p className="text-lg">
              <span className="font-semibold">Finalize seu pagamento:</span>{' '}
              <Link
                href={`/pre-venda/${preorder.id}/pagamento`}
                className="text-orange-400 underline"
              >
                Clique aqui
              </Link>
            </p>
            </Fragment>
          ) : (<Fragment>
             <div className="mt-6 flex justify-center gap-4">
                <Link
                  className="bg-orange-600 hover:bg-orange-700"
                  href={`/pre-venda?v=${preorder.sellerTag}`}
                >
                  Comprar outro
                </Link>
              </div>
          </Fragment>)}
        </div>
      </div>
       
    </Fragment>
  );
}
