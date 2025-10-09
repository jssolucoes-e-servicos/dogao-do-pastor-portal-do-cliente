// components/order-online/steps/adress-info-step.tsx
'use client';

import { DeliveryOptionEnum } from "@/enums";
import { ICustomerAddressBasic, ICustomerAddressFull, PreOrderFindFullResponse } from "@/interfaces";
import { getDistanceBetween } from "@/lib/get-distance-between";
import { DeliveryOption } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeliveryDistanceLimitModal } from "../modals/delivery-distance-limit-modal";
import { Button } from "../ui/button";
import { ContentStepAddressOrderType } from "./content-step-address-order-type";
import { TypeDelivery } from "./pre-order-type/type-delivery";
import { TypeDonate } from "./pre-order-type/type-donate";
import { TypePickup } from "./pre-order-type/type-pickup";

interface PreOrderAddressFormProps {
  preorder: PreOrderFindFullResponse,
  addresses: ICustomerAddressFull[],
  customerId: string
}

export default function PreOrderAddressForm({ preorder, addresses, customerId }: PreOrderAddressFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(DeliveryOptionEnum.pickup);
  const [addressSelectedId, setAddressSelectedId] = useState<string | null>(null)
  
  const [error, setError] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [addressSelected, setAddressSelected] = useState<Partial<ICustomerAddressFull> | null>(null);
  const [addressData, setAddressData] = useState<Partial<ICustomerAddressBasic>>({});

// Localização da igreja
const CHURCH_LAT = -30.1607092;
const CHURCH_LNG = -51.1466475;
const CHURCH_NAME = "Igreja Viva em Células";
const CHURCH_ADDRESS = "Avenida Dr. João Dentice, 241, Restinga, Porto Alegre/RS";

// Controle do modal de limite de entrega
const [showLimitModal, setShowLimitModal] = useState(false);
const [distanceKm, setDistanceKm] = useState<number | null>(null);


useEffect(() => {
    if (addressSelected?.id) {
      setAddressSelectedId(addressSelected.id)
      console.log('EFFECT addressSelectedId:',addressSelected.id);
    }
    
  }, [addressSelected]);

  const handleDeliveriTymeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryTime(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev: Partial<ICustomerAddressFull>) => ({ ...prev, [name]: value }));
  };


  const handleTypedOrder = () => {
    switch (deliveryOption) {
      case DeliveryOptionEnum.delivery:
        return (
          <TypeDelivery
            addressData={addressData}
            showNewAddressForm={showNewAddressForm}
            setShowNewAddressForm={setShowNewAddressForm}
            setAddressData={setAddressData}
            setAddressSelected={setAddressSelected}
            handleAddressChange={handleAddressChange}
            deliveryTime={deliveryTime}
            handleDeliveriTymeChange={handleDeliveriTymeChange}
            addressesList={addresses}
          />
        );
      case DeliveryOptionEnum.pickup:
        return (<TypePickup />)
      case DeliveryOptionEnum.donate:
        return (<TypeDonate />)
      default:
        return null;
    }
  }

  const handleFinalizeAndPay = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    if (deliveryOption === DeliveryOptionEnum.delivery && (!addressData?.street || !addressData.number || !addressData.neighborhood || !addressData.zipCode || !deliveryTime)) {
      setError('Por favor, preencha todos os campos obrigatórios para a entrega.');
      setIsLoading(false);
      return;
    }

    if (deliveryOption === DeliveryOptionEnum.delivery) {
      const fullAddress = `${addressData.street}, ${addressData.number}, ${addressData.neighborhood}, ${addressData.city} - ${addressData.state}, ${addressData.zipCode}`;

  let distance: number | null = null;

  try {
    distance = await getDistanceBetween(CHURCH_LAT, CHURCH_LNG, fullAddress);
  } catch (err) {
    console.error("Erro inesperado ao validar distância:", err);
    toast.error("Não foi possível verificar a distância de entrega. Tente novamente.");
    setIsLoading(false);
    return; // 🔒 Bloqueia execução
  }

  if (distance === null) {
    toast.error("Não foi possível calcular a distância. Verifique o endereço ou tente novamente.");
    setIsLoading(false);
    return; // 🔒 Bloqueia execução
  }

  setDistanceKm(distance);
      if (distance && distance > 5) {
        // Excede o limite — mostra o modal e cancela execução
        setShowLimitModal(true);
        setIsLoading(false);
        return;
      }

      try {
        const resAddress = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-address/proccess-entry`, {
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
        console.log('adressResult: ',adressResult);
        setAddressSelected(adressResult);
        //setAddressSelectedId(adressResult.id);
      } catch (err: unknown) {
        console.error("Erro ao salvar o endereço", err);
        toast.error("Falaha ao salvar endereço de entrega!");
        if (err instanceof Error) {
          setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
        } else {
          setError('Ocorreu um erro inesperado. Tente novamente.');
        }
        return
      }
    }


    console.log('addressSelectedId:',addressSelectedId);
    const sendData = {
      preorderId: preorder.id,
      deliveryAddressId: deliveryOption === DeliveryOptionEnum.delivery ? addressSelectedId : null,
      deliveryOption: deliveryOption,
      deliveryTime: deliveryOption === DeliveryOptionEnum.delivery ? deliveryTime : null, 
    }

    try {
      if (deliveryOption === DeliveryOptionEnum.delivery) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online/set-address`, {
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
        router.push(`/comprar/${preorder.id}/pagamento`);
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online/set-selivery-option`, {
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
        router.push(`/comprar/${preorder.id}/pagamento`);
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

  const onSendToReview = async () => {
    try{
      setIsLoading(true);
      setShowLimitModal(false);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online/set-analysis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preorderId: preorder.id,
            deliveryAddressId: addressSelectedId,
            distance: distanceKm,
            deliveryTime: deliveryTime, 
          }),
        });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar o pedido. Por favor, tente novamente.');
      }
      router.push(`/comprar/${preorder.id}/analise`);
      toast.info("Pedido enviado para análise da equipe da igreja.");
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
      <DeliveryDistanceLimitModal
      isOpen={showLimitModal}
  onClose={() => setShowLimitModal(false)}
  onPickupSelect={() => {
    setDeliveryOption(DeliveryOptionEnum.pickup);
    setShowLimitModal(false);
    toast.info("Modo de entrega alterado para retirada no local.");
  }}
  onSendToReview={onSendToReview}
  churchName={CHURCH_NAME}
  churchAddress={CHURCH_ADDRESS}
  distanceKm={distanceKm || undefined}
/>
      <div className="flex justify-center mt-6">
        <Button type="button" onClick={handleFinalizeAndPay} disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-700">
          {isLoading ? 'Processando...' : 'Ir para pagamento'}
        </Button>
      </div>
    </div>
  );
}
