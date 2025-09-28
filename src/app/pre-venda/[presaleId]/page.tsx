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
  if (preorder.status !== 'DIGITATION') { redirect(`/pre-venda/${presaleId}/obrigado`) }
  return (
    <Fragment>
      <PreOrderCustomerForm preorder={preorder} />
    </Fragment>
  );
}
