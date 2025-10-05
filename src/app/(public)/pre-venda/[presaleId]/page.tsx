import { PreOrderCustomerForm } from "@/components/pre-order/customer-form";
import { RedirectInitialStepsHelper } from "@/helpers/redirect-steps.helper";
import { Fragment } from "react";
import { PreOrderStepEnum } from '../../../../enums/pre-order-step.enum';

interface PresalePageProps {
  params: { presaleId: string }
}

export default async function PresalePage({ params }: PresalePageProps) {
  const { presaleId } = params;
  const preorder = await RedirectInitialStepsHelper({
    presaleId,
    page: PreOrderStepEnum.customer});
  return (
    <Fragment>
      <PreOrderCustomerForm preorder={preorder} />
    </Fragment>
  );
}
