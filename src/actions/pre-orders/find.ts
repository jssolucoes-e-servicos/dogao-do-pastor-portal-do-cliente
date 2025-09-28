"use server";

import { PreOrderFindResponse } from "@/interfaces";
import { redirect } from "next/navigation";

export const findPreOrder = async (id: string): Promise<PreOrderFindResponse | null> => {
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pre-sale/${id}`, {
      cache: "no-store", // sempre buscar fresh
    });

    const data: PreOrderFindResponse | null = await res.json();
    //console.info('findPreOrder:', data);
    return data
  } catch (error) {
    console.error(error);
    redirect('off-line');
  }
};