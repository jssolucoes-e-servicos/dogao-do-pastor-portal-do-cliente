"use server";

import { PreOrderFindInitialResponse } from "@/interfaces";
import { redirect } from "next/navigation";

export const findPreOrder = async (id: string): Promise<PreOrderFindInitialResponse | null> => {
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pre-sale/${id}`, {
      cache: "no-store", // sempre buscar fresh
    });

    const data: PreOrderFindInitialResponse | null = await res.json();
    //console.info('findPreOrder:', data);
    return data
  } catch (error) {
    console.error(error);
    redirect('off-line');
  }
};