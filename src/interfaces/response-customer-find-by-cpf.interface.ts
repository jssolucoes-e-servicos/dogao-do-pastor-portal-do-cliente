//interfaces/response-customer-find-by-cpf.interface.ts
import { ICustomerFull } from "./curtomer-full.interface";
import { ICustomerAddressFull } from "./customer-address-full.interface";
export interface IResponseCstomerFindByCPF {
  customer: ICustomerFull | null;
  addresses: ICustomerAddressFull[] | null;
}