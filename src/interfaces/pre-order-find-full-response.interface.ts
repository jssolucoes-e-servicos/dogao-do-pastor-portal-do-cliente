export interface PreOrderFindFullResponse {
  id: string;
  customerId: string;
  customer: CustomerRetrieve;
  editionId: string;
  sellerId:string;
  sellerTag:string;
  quantity: number;
  valueTotal: number;
  paymentStatus: string;
  paymentProvider: string;
  paymentId?: string | null;
  paymentUrl?: string | null;
  paymentMethod?: string | null;
  customerAddressId?: string | null;
  observations: string;
  deliveryOption: string;
  paymentPixQrcode?:string;
  paymentPixCopyPaste?:string;
  status: string;
  isPromo: boolean;
  active: boolean;
  step: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CustomerRetrieve {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  cpf: string;
  knowsChurch: boolean;
  allowsChurch: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}