
import { Fragment } from "react";

interface PresalePageProps {
  params: Promise<{ preOrderId: string }>
}

export default async function PreorderStatusPage({ params }: PresalePageProps) {
  const { preOrderId } = await params;
   
  return (
    <Fragment>
      Acompanhamento do pedido {preOrderId}
    </Fragment>
  );
}
