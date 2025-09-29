// pre-venda/page.tsx
import { PreOrderCPFForm } from '@/components/pre-order/cpf-form';
import { SELLER_ID } from '@/constants';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';

interface PreVendaProps {
  searchParams: Promise<{ v?: string }>;
}

export default async function PreVenda({ searchParams }: PreVendaProps) {
  const params = await searchParams;
  const sellerSlug = params.v || 'dogao';
  let sellerId = null;
  let seller = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellers/find-by-tag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag: sellerSlug }),
    });
    const json = await response.json();
    if (response.ok) {
      sellerId = json.id;
      seller = json
    } else {
      sellerId = SELLER_ID;
    }
  } catch (error) {
    console.error(error);
    redirect('/off-line');
  }

  return (
    <Fragment>
      < PreOrderCPFForm sellerId={sellerId} seller={seller} />
    </Fragment>
  );
}
