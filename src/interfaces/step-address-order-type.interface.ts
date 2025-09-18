import { DeliveryOption } from "@/types/preOrderRequest";
import { Dispatch, SetStateAction } from "react";

export interface IStepAddressOrderType extends ICotentStepAddressOrderType {
  type: DeliveryOption;
}

export interface ICotentStepAddressOrderType {
  deliveryOption: DeliveryOption;
  setDeliveryOption: Dispatch<SetStateAction<DeliveryOption>>;
}