import { PaymentsForm } from "@/components/pre-order/payments-form";
import { OrderStatsEnum, PreOrderStepEnum } from "@/enums";
import { RedirectStepsHelper } from "@/helpers/redirect-steps.helper";

import { redirect } from 'next/navigation';
import { Fragment } from "react";

interface PresalePageProps {
  params: Promise<{ presaleId: string }>
}

export default async function PreOrderPaymentsPage({ params }: PresalePageProps) {
  const { presaleId } = await params;
   const preorder = await RedirectStepsHelper({
        presaleId,
        page: PreOrderStepEnum.payment});
  if (preorder.status === OrderStatsEnum.payd) { redirect(`/pre-venda/${presaleId}/ogrigado`) }
  return (
    <Fragment>
      <PaymentsForm preorder={preorder} />
    </Fragment>
  );
}
