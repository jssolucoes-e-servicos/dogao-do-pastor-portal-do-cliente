"use server";

import { PreOrderFindFullResponse, PreOrderFindInitialResponse } from "@/interfaces";
import { redirect } from "next/navigation";

export const findPreInitialOrder = async (id: string): Promise<PreOrderFindInitialResponse | null> => {
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online/${id}`, {
      cache: "no-store", // sempre buscar fresh
    });

    let data: PreOrderFindInitialResponse | null = await res.json();
    if (data === undefined) 
      data = null;
    return data
  } catch (error) {
    console.error(error);
    redirect('off-line');

  }
};

export const findPreOrder = async (id: string): Promise<PreOrderFindFullResponse | null> => {
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online/${id}`, {
      cache: "no-store", // sempre buscar fresh
    });

    let data: PreOrderFindFullResponse | null = await res.json();
    if( data === undefined)
      data = null;
    return data
  } catch (error) {
    console.error(error);
    redirect('off-line');
  }
};