import { findPreOrder } from "@/actions/pre-orders/find";
import { TanksForPreOrder } from "@/components/pre-order/tanks-for-pre-order";
import { redirect } from "next/navigation";

import { Fragment } from "react";

interface PresalePageProps {
  params: { presaleId: string }
}

export default async function AddressPage({ params }: PresalePageProps) {
  const { presaleId } = params;
  const preorder = await findPreOrder(presaleId);
  if (!preorder) { redirect('/off-line'); }
  if (preorder.status !== 'PAYMENT') { redirect(`/pre-venda/${presaleId}/pagamento`) }

  return (
    <Fragment>
      <TanksForPreOrder preorder={preorder} />
    </Fragment>
  );
}
