export interface ICustomer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  knowsChurch?: boolean | null;
  allowsChurch?: boolean | null;
  active?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}