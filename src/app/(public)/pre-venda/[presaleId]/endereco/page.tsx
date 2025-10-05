import { findCustomerAddressByCustomer } from "@/actions/customer-addresses/find-by-customer";
import PreOrderAddressForm from "@/components/pre-order/addresses-form";
import { PreOrderStepEnum } from "@/enums";
import { RedirectStepsHelper } from "@/helpers/redirect-steps.helper";

import { Fragment } from "react";

interface PresalePageProps {
  params: Promise<{ presaleId: string }>
}

export default async function PreOrderAddressPage({ params }: PresalePageProps) {
  const { presaleId } = await params;
  const preorder = await RedirectStepsHelper({
      presaleId,
      page: PreOrderStepEnum.delivery});
  
  const addresses = await findCustomerAddressByCustomer(preorder.customerId)

  return (
    <Fragment>
      <PreOrderAddressForm preorder={preorder} addresses={addresses} customerId={preorder.customerId} />
    </Fragment>
  );
}
