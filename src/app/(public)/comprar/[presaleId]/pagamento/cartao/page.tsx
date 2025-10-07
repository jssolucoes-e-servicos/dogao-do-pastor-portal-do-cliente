import { PaymentCard } from "@/components/order-online/payment-card";
import { OrderStatsEnum, PreOrderStepEnum } from "@/enums";
import { RedirectStepsHelper } from "@/helpers/redirect-steps.helper";

import { redirect } from 'next/navigation';
import { Fragment } from "react";

interface PresalePageProps {
  params: Promise<{ presaleId: string }>
}

export default async function PreOrderPaymentCardPage({ params }: PresalePageProps) {
  const { presaleId } = await params;
   const preorder = await RedirectStepsHelper({
        presaleId,
        page: PreOrderStepEnum.card});
  if (preorder.status === OrderStatsEnum.payd) { redirect(`/comprar/${presaleId}/ogrigado`) }
  return (
    <Fragment>
      <PaymentCard preorder={preorder} />
    </Fragment>
  );
}
