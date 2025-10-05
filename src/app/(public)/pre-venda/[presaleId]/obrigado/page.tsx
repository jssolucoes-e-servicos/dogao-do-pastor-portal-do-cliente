import { TanksForPreOrder } from "@/components/pre-order/tanks-for-pre-order";
import { PreOrderStepEnum } from "@/enums";
import { RedirectStepsHelper } from "@/helpers/redirect-steps.helper";

import { Fragment } from "react";

interface PresalePageProps {
  params: Promise<{ presaleId: string }>
}

export default async function PreOrderTanksPage({ params }: PresalePageProps) {
  const { presaleId } = await params;
   const preorder = await RedirectStepsHelper({
        presaleId,
        page: PreOrderStepEnum.tanks});

  return (
    <Fragment>
      <TanksForPreOrder preorder={preorder} />
    </Fragment>
  );
}
