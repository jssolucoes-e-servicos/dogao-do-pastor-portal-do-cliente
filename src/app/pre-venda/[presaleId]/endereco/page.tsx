import { findCustomerAddressByCustomer } from "@/actions/customer-addresses/find-by-customer";
import { findPreOrder } from "@/actions/pre-orders/find";
import PreOrderAddressForm from "@/components/pre-order/addresses-form";
import { redirect } from "next/navigation";

import { Fragment } from "react";

interface PresalePageProps {
  params: { presaleId: string }
}

export default async function AddressPage({ params }: PresalePageProps) {
  const { presaleId } = params;
  const preorder = await findPreOrder(presaleId);
  if (!preorder) { redirect('/off-line'); }
  if (preorder.status !== 'DIGITATION') { redirect(`/pre-venda/${presaleId}/obrigado`) }
  const customerId = preorder?.customerId ? preorder.customerId : redirect("/off-line")
  const addresses = await findCustomerAddressByCustomer(customerId)

  return (
    <Fragment>
      <PreOrderAddressForm preorder={preorder} addresses={addresses} customerId={customerId} />
    </Fragment>
  );
}
