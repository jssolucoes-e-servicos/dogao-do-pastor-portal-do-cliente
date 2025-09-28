import { findPreOrder } from "@/actions/pre-orders/find";
import { PreOrderCustomerForm } from "@/components/pre-order/customer-form";

import { redirect } from 'next/navigation';
import { Fragment } from "react";

interface PresalePageProps {
  params: { presaleId: string }
}

export default async function PresalePage({ params }: PresalePageProps) {
  const { presaleId } = params;
  const preorder = await findPreOrder(presaleId);
  if (!preorder) { redirect('/off-line'); }
  return (
    <Fragment>
      <PreOrderCustomerForm preorder={preorder} />

      <strong> --------------- JSON ----------------- </strong>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Pré-venda {presaleId}</h1>
        <pre>{JSON.stringify(preorder, null, 2)}</pre>
      </div>
    </Fragment>
  );
}
