import { PreOrderCustomerForm } from "@/components/order-online/customer-form";
import { PreOrderStepEnum } from '@/enums/pre-order-step.enum';
import { RedirectInitialStepsHelper } from "@/helpers/redirect-steps.helper";
import { Fragment } from "react";

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
