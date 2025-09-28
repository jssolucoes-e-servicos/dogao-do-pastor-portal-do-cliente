// components/pre-sale/steps/adress-info-step.tsx
'use client';

import { useToast } from "@/components/ui/use-toast";
import { ICustomerAddressBasic, ICustomerAddressFull, PreOrderFindResponse } from "@/interfaces";
import { DeliveryOption } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { ContentStepAddressOrderType } from "./content-step-address-order-type";
import { TypeDelivery } from "./pre-order-type/type-delivery";
import { TypeDonate } from "./pre-order-type/type-donate";
import { TypePickup } from "./pre-order-type/type-pickup";

interface PreOrderAddressFormProps {
  preorder: PreOrderFindResponse,
  addresses: ICustomerAddressFull[],
  customerId: string
}

export default function PreOrderAddressForm({ preorder, addresses, customerId }: PreOrderAddressFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('PICKUP');
  const [addressSelectedId, setAddressSelectedId] = useState<string | null>(null)
  const [addressSelected, setAddressSelected] = useState<Partial<ICustomerAddressFull> | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<Partial<ICustomerAddressBasic>>({});

  const handleDeliveriTymeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryTime(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev: Partial<ICustomerAddressFull>) => ({ ...prev, [name]: value }));
  };


  const handleTypedOrder = () => {
    switch (deliveryOption) {
      case 'DELIVERY':
        return (
          <TypeDelivery
            addressData={addressData}
            showNewAddressForm={showNewAddressForm}
            setShowNewAddressForm={setShowNewAddressForm}
            setAddressData={setAddressData}
            handleAddressChange={handleAddressChange}
            deliveryTime={deliveryTime}
            handleDeliveriTymeChange={handleDeliveriTymeChange}
            addressesList={addresses}
          />
        );
      case 'PICKUP':
        return (<TypePickup />)
      case 'DONATE':
        return (<TypeDonate />)
      default:
        return null;
    }
  }

  const handleFinalizeAndPay = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    if (deliveryOption === 'DELIVERY' && (!addressSelected?.street || !addressSelected.number || !addressSelected.neighborhood || !addressSelected.zipCode)) {
      setError('Por favor, preencha todos os campos obrigatórios para a entrega.');
      setIsLoading(false);
      return;
    }

    if (deliveryOption === 'DELIVERY') {
      try {
        const resAddress = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-addresses/proccess-entry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: customerId,
            street: addressData.street,
            number: addressData.number,
            neighborhood: addressData.neighborhood,
            city: addressData.city,
            state: addressData.state,
            zipCode: addressData.zipCode,
            complement: addressData.complement,
          }),
        });
        const adressResult: ICustomerAddressFull = await resAddress.json();
        setAddressSelectedId(adressResult.id);
      } catch (err: unknown) {
        console.error("Erro ao salvar o endereço", err);
        if (err instanceof Error) {
          setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
        } else {
          setError('Ocorreu um erro inesperado. Tente novamente.');
        }
      }
    }

    const sendData = {
      preorderId: preorder.id,
      deliveryAddressId: deliveryOption === 'DELIVERY' ? addressSelectedId : null,
      deliveryOption: deliveryOption
    }

    try {
      if (deliveryOption === 'DELIVERY') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pre-sale/set-address`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao processar o pedido. Por favor, tente novamente.');
        }
        router.push(`/pre-venda/${preorder.id}/pagamento`);
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pre-sale/set-selivery-option`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao processar o pedido. Por favor, tente novamente.');
        }
        router.push(`/pre-venda/${preorder.id}/pagamento`);
      }
    } catch (err: unknown) {
      console.error("Erro ao finalizar o pedido:", err);
      if (err instanceof Error) {
        setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
      <ContentStepAddressOrderType
        setDeliveryOption={setDeliveryOption}
        deliveryOption={deliveryOption}
      />
      {handleTypedOrder()}
      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">
          {error}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Button type="button" onClick={handleFinalizeAndPay} disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-700">
          {isLoading ? 'Processando...' : 'Ir para pagamento'}
        </Button>
      </div>
    </div>
  );
}
