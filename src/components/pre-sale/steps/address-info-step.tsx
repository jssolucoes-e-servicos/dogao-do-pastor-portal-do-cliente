// Path: components/pre-sale/steps/adress-info-step.tsx
'use client';
import { Button } from '@/components/ui/button';
import { IAddressData, IPreOrderCustomer } from '@/types/preOrderRequest';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ContentStepAddressOrderType } from './elements/content-step-address-order-type';
import { TypeDelivery } from './elements/type-delivery';
import { TypeDonate } from './elements/type-donate';
import { TypePickup } from './elements/type-pickup';

// Define a estrutura do objeto de pedido completo que será enviado para a API
interface ICompletePreOrderRequest {
  customer: Omit<IPreOrderCustomer, 'addresses'>;
  deliveryAddress: Partial<IAddressData> | null;
  deliveryOption: 'pickup' | 'delivery' | 'donate';
  items: any[];
}

interface AddressInfoStepProps {
  onPrevious: () => void;
  customerData: IPreOrderCustomer;
  setCustomerData: Dispatch<SetStateAction<IPreOrderCustomer>>;
  cartItems: any[]; // Adicionei os itens do carrinho aqui
}

type DeliveryOption = 'pickup' | 'delivery' | 'donate';

export default function AddressInfoStep({ onPrevious, customerData, setCustomerData, cartItems }: AddressInfoStepProps) {
  // Define o tipo de entrega padrão como 'pickup'
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('pickup');
  const [addressData, setAddressData] = useState<Partial<IAddressData>>({});
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerData.addresses && customerData.addresses.length > 0) {
      setAddressData(customerData.addresses[0]);
      setDeliveryOption('delivery');
    } else {
      setAddressData({});
      setShowNewAddressForm(true);
    }
  }, [customerData]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev: Partial<IAddressData>) => ({ ...prev, [name]: value }));
  };

  const handleFinalizeAndPay = async () => {
    if (isProcessing) return;

    setError(null);
    setIsProcessing(true);

    if (!customerData.customer?.cpf) {
      setError('O CPF é obrigatório para a finalização do pedido.');
      setIsProcessing(false);
      return;
    }

    if (deliveryOption === 'delivery' && (!addressData.street || !addressData.number || !addressData.zipCode)) {
      setError('Por favor, preencha todos os campos obrigatórios para a entrega.');
      setIsProcessing(false);
      return;
    }

    // Criar um objeto de cliente mais limpo sem o array de endereços
    const cleanedCustomer = {
      ...customerData.customer,
    };
    delete cleanedCustomer.addresses;

    let orderData: ICompletePreOrderRequest;

    // Condicional para montar o payload com ou sem endereço de entrega
    if (deliveryOption === 'delivery') {
      orderData = {
        customer: cleanedCustomer,
        deliveryAddress: addressData,
        deliveryOption,
        items: cartItems
      };
    } else {
      orderData = {
        customer: cleanedCustomer,
        deliveryAddress: null,
        deliveryOption,
        items: cartItems
      };
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

      const paymentInfo = await response.json();

      window.location.href = paymentInfo.initPoint;

    } catch (err: any) {
      console.error("Erro ao finalizar o pedido:", err);
      setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTypedOrder = () => {
    switch (deliveryOption) {
      case 'delivery':
        return (
          <TypeDelivery
            customerData={customerData}
            addressData={addressData}
            showNewAddressForm={showNewAddressForm}
            setCustomerData={setCustomerData}
            setShowNewAddressForm={setShowNewAddressForm}
            setAddressData={setAddressData}
            handleAddressChange={handleAddressChange}
          />
        );
      case 'pickup':
        return (<TypePickup />)
      case 'donate':
        return (<TypeDonate />)
      default:
        break;
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
