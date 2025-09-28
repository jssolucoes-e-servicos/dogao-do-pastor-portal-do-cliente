export interface IPreSaleBasic {
  id: string;
  editionId: string;
  sellerId: string;
  customerId: string | null;
  customerAddressId: string | null;
  deletedAt: Date | null;
  deliveryOption: string;
  quantity: number;
  valueTotal: number;
  observations: string | null;
  paymentId: string | null;
  paymentProvider: string;
  paymentStatus: string;
  paymentUrl: string | null;
  isPromo: boolean;
  status: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date
}