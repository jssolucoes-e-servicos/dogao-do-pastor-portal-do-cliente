import { PaymentPix } from "@/components/pre-order/payment-pix";
import { OrderStatsEnum, PreOrderStepEnum } from "@/enums";
import { RedirectStepsHelper } from "@/helpers/redirect-steps.helper";

import { redirect } from 'next/navigation';
import { Fragment } from "react";

interface PresalePageProps {
  params: Promise<{ presaleId: string }>
}

export default async function PreOrderPaymentPixPage({ params }: PresalePageProps) {
  const { presaleId } = await  params;
   const preorder = await RedirectStepsHelper({
        presaleId,
        page: PreOrderStepEnum.pix});
  if (preorder.status === OrderStatsEnum.payd) { redirect(`/pre-venda/${presaleId}/obrigado`) }
  return (
    <Fragment>
      <PaymentPix preorder={preorder}/>
    </Fragment>
  );
}
