//components/pre-sale/index.tsx
'use client';
import AddressInfoStep from '@/components/pre-sale/steps/address-info-step';
import CpfSearchStep from '@/components/pre-sale/steps/cpf-search-step';
import CustomerInfoStep from '@/components/pre-sale/steps/customer-info-step';
import OrderDetailsStep from '@/components/pre-sale/steps/order-details-step';
import { PRICE_PER_DOG } from '@/constants';
import { ICustomerBasic, ICustomerFullWithAddress, IPreOrderItem } from '@/interfaces';
import { PreOrderFormStep } from '@/types/pre-order-form-steps.type';
import { useState } from 'react';

export function PreSaleForm({ sellerId }: { sellerId: string }) {
  const [step, setStep] = useState<PreOrderFormStep>('cpf-search');
  const [cpf, setCpf] = useState('84005017053');
  const [customer, setCustomer] = useState<ICustomerFullWithAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<IPreOrderItem[]>([]);
  const [newCustomerFormData, setNewCustomerFormData] = useState<ICustomerBasic>({
    cpf: cpf,
    name: '',
    email: '',
    phone: '',
    knowsChurch: true,
    allowsChurch: true
  });

  console.log('sellerId', sellerId);

  const handleNextStep = () => {
    if (step === 'customer-info') {
      setStep('order-details');
    } else if (step === 'order-details') {
      setStep('address-info');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'order-details') {
      setStep('customer-info');
    } else if (step === 'address-info') {
      setStep('order-details');
    }
  };

  const total = orderItems.length * PRICE_PER_DOG;

  const renderStep = () => {
    switch (step) {
      case 'cpf-search':
        return (
          <CpfSearchStep
            cpf={cpf}
            setCpf={setCpf}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setCustomer={setCustomer}
            setStep={setStep}
          />
        );
      case 'customer-info':
        return (
          <CustomerInfoStep
            cpf={cpf}
            customer={customer}
            setCustomer={setCustomer}
            onNext={handleNextStep}
            onPrevious={() => setStep('cpf-search')}
          />
        );
      case 'order-details':
        return (
          <OrderDetailsStep
            dogPrice={PRICE_PER_DOG}
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            onNext={() => handleNextStep()}
            onPrevious={handlePreviousStep}
          />
        );
      case 'address-info':
        return (
          <AddressInfoStep
            onPrevious={handlePreviousStep}
            customerId={customer?.id}
            addressesList={customer?.addresses}
            orderItems={orderItems}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
        Detalhes do Pedido
      </h2>
      {renderStep()}
    </div>
  );
}
