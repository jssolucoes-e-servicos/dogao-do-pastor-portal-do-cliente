import { IEdition } from "@/interfaces";
import { prisma } from "@/lib/prisma";

export async function GetActiveEdition(): Promise<IEdition> {
  const edition = await prisma.edition.findFirst({ where: { active: true } });
  if (!edition) throw new Error('Fail on request edition data');
  return edition;
} 