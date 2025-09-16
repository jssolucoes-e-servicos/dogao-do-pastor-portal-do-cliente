import { ICustomerAdress, ICustomerPreOrder, IPreOrderItem } from '@/interfaces';

export interface IPreOrderRequest {
  customerData: ICustomerPreOrder,
  orderItems: IPreOrderItem[],
  deliveryAddress: ICustomerAdress,
  cpf: string,
}