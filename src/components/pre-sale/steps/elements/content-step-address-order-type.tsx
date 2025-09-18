//components/pre-sale//steps/elements/step-address-order-type-button.tsx
'use client';
import { StepAddressOrderTypeButton } from "@/components/buttons/step-address-order-type-button";
import { ICotentStepAddressOrderType } from "@/interfaces";
import { Fragment } from "react";

export function ContentStepAddressOrderType({ deliveryOption, setDeliveryOption }: ICotentStepAddressOrderType) {
  return (
    <Fragment>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-2">Detalhes de Entrega</h2>
        <p className="text-gray-600 text-center">Selecione uma opção para o seu pedido.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
        <StepAddressOrderTypeButton
          type="pickup"
          setDeliveryOption={setDeliveryOption}
          deliveryOption={deliveryOption}
        />
        <StepAddressOrderTypeButton
          type="delivery"
          setDeliveryOption={setDeliveryOption}
          deliveryOption={deliveryOption}
        />
        <StepAddressOrderTypeButton
          type="donate"
          setDeliveryOption={setDeliveryOption}
          deliveryOption={deliveryOption}
        />
      </div>
    </Fragment>
  )
}