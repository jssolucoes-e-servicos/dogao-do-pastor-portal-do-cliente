import { findPreOrder } from "@/actions/pre-orders/find";
import {ItemsForm} from "@/components/pre-order/items-form";
import { redirect } from 'next/navigation';
import { Fragment } from "react";

interface PresalePageProps {
  params: { presaleId: string }
}

export default async function PresalePage({ params }: PresalePageProps) {
  const { presaleId } = params;
  const preorder = await findPreOrder(presaleId);
  if (!preorder) { redirect('/off-line'); }
  return (
    <Fragment>
      <ItemsForm preorder={preorder} />
    </Fragment>
  );
}
