export interface PreOrderFindResponse {
  id: string;
  customerId?: string | null;
  customer?: CustomerRetrieve | null;
  editionId: string;
  quantity: number;
  valueTotal: number;
  paymentStatus: string;
  paymentProvider: string;
  paymentId?: string | null;
  paymentUrl?: string | null;
  customerAddressId?: string | null;
  observations: string;
  deliveryOption: string;
  status: string;
  isPromo: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CustomerRetrieve {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  knowsChurch?: boolean;
  allowsChurch?: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}