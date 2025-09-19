// components/pre-sale/steps/adress-info-step.tsx
'use client';
import { Button } from '@/components/ui/button';
import { ICustomerAddressFull, ICustomerFull, IPreOrderItem } from '@/interfaces';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DeliveryOption } from '../../../types/delivery-options.type';
import { ContentStepAddressOrderType } from './elements/content-step-address-order-type';
import { TypeDelivery } from './elements/type-delivery';
import { TypeDonate } from './elements/type-donate';
import { TypePickup } from './elements/type-pickup';

interface AddressInfoStepProps {
  onPrevious: () => void;
  customerId: string | undefined;
  addressesList: ICustomerAddressFull[] | undefined
  orderItems: IPreOrderItem[];
  setCustomerData: Dispatch<SetStateAction<ICustomerFull | undefined>>;
}

export default function AddressInfoStep({ onPrevious, customerId, addressesList, orderItems, setCustomerData }: AddressInfoStepProps) {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('pickup');
  const [addressSelected, setAddressSelected] = useState<Partial<ICustomerAddressFull> | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<Partial<ICustomerAddressFull>>({});

  useEffect(() => {
    if (addressesList && addressesList.length > 0) {
      setAddressSelected(addressesList[0]);
      setDeliveryOption('pickup');
    } else {
      setAddressSelected(null);
      setShowNewAddressForm(true);
    }
  }, [addressesList]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev: Partial<ICustomerAddressFull>) => ({ ...prev, [name]: value }));
  };

  const handleDeliveriTymeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryTime(e.target.value);
  };

  const handleFinalizeAndPay = async () => {
    if (isProcessing) return;

    setError(null);
    setIsProcessing(true);

    if (deliveryOption === 'delivery' && (!addressSelected?.street || !addressSelected.number || !addressSelected.neighborhood || !addressSelected.zipCode)) {
      setError('Por favor, preencha todos os campos obrigatórios para a entrega.');
      setIsProcessing(false);
      return;
    }

    const orderData = {
      customerId: customerId,
      deliveryAddressId: deliveryOption === 'delivery' ? addressSelected?.id : null,
      deliveryOption,
      orderItems: orderItems
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pre-sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar o pedido. Por favor, tente novamente.');
      }

      const data = await response.json();

      if (data.paymentUrl) {
        // Redireciona o cliente para o link de pagamento do Mercado Pago
        window.location.href = data.paymentUrl;
      } else {
        console.error('URL de pagamento não recebida na resposta.');
        // Mostre uma mensagem de erro para o usuário
      }

    } catch (err: unknown) {
      console.error("Erro ao finalizar o pedido:", err);
      if (err instanceof Error) {
        setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTypedOrder = () => {
    switch (deliveryOption) {
      case 'delivery':
        return (
          <TypeDelivery
            customerId={customerId}
            addressData={addressData}
            showNewAddressForm={showNewAddressForm}
            setShowNewAddressForm={setShowNewAddressForm}
            setAddressData={setAddressData}
            handleAddressChange={handleAddressChange}
            deliveryTime={deliveryTime}
            handleDeliveriTymeChange={handleDeliveriTymeChange}
            addressesList={addressesList || []}
            setCustomerData={setCustomerData}
          />
        );
      case 'pickup':
        return (<TypePickup />)
      case 'donate':
        return (<TypeDonate />)
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
      <div className="flex justify-start items-center mb-4">
        <Button type="button" variant="ghost" onClick={onPrevious}>
          Voltar
        </Button>
      </div>
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
        <Button type="button" onClick={handleFinalizeAndPay} disabled={isProcessing} className="w-full">
          {isProcessing ? 'Processando...' : 'Ir para pagamento'}
        </Button>
      </div>
    </div>
  );
}
