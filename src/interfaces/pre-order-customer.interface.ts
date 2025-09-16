export interface ICustomerPreOrder {
  id?: string | null;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  knowsChurch?: boolean | null;
  allowsChurch?: boolean | null;
  active?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}