import { ICell } from "@/interfaces";

export interface ISeller {
  id: string;
  cellId: string;
  cell: ICell,
  name: string;
  phone: string;
  tag: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}