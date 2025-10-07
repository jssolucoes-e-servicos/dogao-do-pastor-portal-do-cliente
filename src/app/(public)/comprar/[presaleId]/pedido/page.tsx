import { ItemsForm } from "@/components/order-online/items-form";
import { PreOrderStepEnum } from "@/enums";
import { RedirectStepsHelper } from "@/helpers/redirect-steps.helper";
import { Fragment } from "react";

interface PresalePageProps {
  params: Promise<{ presaleId: string }>
}

export default async function PresalePage({ params }: PresalePageProps) {
  const { presaleId } = await params;
   const preorder = await RedirectStepsHelper({
        presaleId,
        page: PreOrderStepEnum.order});
  return (
    <Fragment>
      <ItemsForm preorder={preorder} />
    </Fragment>
  );
}
