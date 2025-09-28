//interfaces/index.ts

import { ICell } from './cell.interface';
import { ICotentStepAddressOrderType } from './content-step-address-order-type.interface';
import { ICustomerFullWithAddress } from './curtomer-full-with-address.interface';
import { ICustomerFull } from './curtomer-full.interface';
import { ICustomerAddressBasic } from './customer-address-basic.interface';
import { ICustomerAddressFull } from './customer-address-full.interface';
import { ICustomerBasic } from './customer-basic.interace';
import { CustomerRetrieve, PreOrderFindResponse } from './pre-order-find-response.interface';
import { IPreOrderItem } from './pre-order-items.interface';
import { IPreSaleBasic } from './pre-sale-basic.interface';
import { IPresaleStartResponse } from './presale-start-response.interface';
import { IResponseCstomerFindByCPF } from './response-customer-find-by-cpf.interface';
import { ISeller } from './seller.interface';
import { IStepAddressOrderType } from './step-address-order-type.interface';

export type { CustomerRetrieve, ICell, ICotentStepAddressOrderType, ICustomerAddressBasic, ICustomerAddressFull, ICustomerBasic, ICustomerFull, ICustomerFullWithAddress, IPreOrderItem, IPreSaleBasic, IPresaleStartResponse, IResponseCstomerFindByCPF, ISeller, IStepAddressOrderType, PreOrderFindResponse };

