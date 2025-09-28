import { ICustomerFullWithAddress } from "./curtomer-full-with-address.interface";
import { IPreSaleBasic } from "./pre-sale-basic.interface";

export interface IPresaleStartResponse {
  presale: IPreSaleBasic;
  customer: ICustomerFullWithAddress | null;
}