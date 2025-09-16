'use client';

import { useState } from 'react';
import CpfSearchStep from '@/components/pre-sale/steps/cpf-search-step';
import CustomerInfoStep from '@/components/pre-sale/steps/customer-info-step';
import OrderDetailsStep from '@/components/pre-sale/steps/order-details-step';
import AddressInfoStep from '@/components/pre-sale/steps/address-info-step';

// Interfaces (tipos)
export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  addresses: AddressData[] | null;
}

export interface AddressData {
  id?: string;
  street: string;
  number: string;
  neighborhood?: string | null;
  city: string;
  state: string;
  zipCode?: string | null;
  complement?: string | null;
}

export interface FetchedCustomerData {
  customer: Customer | null;
  addresses: AddressData[] | null;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
}

export interface PreOrderItemState {
  id: number;
  removedIngredients: string[];
}

// MOCKS
const MOCK_CUSTOMERS: { [key: string]: Customer | null } = {
  '84005017053': {
    id: '1',
    name: 'Jackson',
    email: 'jackson@test.com',
    phone: '51982488374',
    addresses: [{
      id: 'addr1',
      street: 'Avenida Teste',
      number: '123',
      neighborhood: 'Centro',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '90000-000',
      complement: 'Apto 101'
    }]
  },
  '12345678909': null, // Novo cliente
};
const PRICE_PER_DOG = 19.99;

export function PreSaleForm() {
  const [step, setStep] = useState<'cpf-search' | 'customer-info' | 'order-details' | 'address-info'>('cpf-search');
  const [cpf, setCpf] = useState('84005017053');
  const [customerData, setCustomerData] = useState<FetchedCustomerData | null>(null);
  const [newCustomerFormData, setNewCustomerFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<PreOrderItemState[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const handleCpfSearch = async () => {
    setIsLoading(true);
    // Simula uma busca na API
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = MOCK_CUSTOMERS[cpf] ? { customer: MOCK_CUSTOMERS[cpf] } : { customer: null };

    setCustomerData({
      customer: data.customer,
      addresses: data.customer ? data.customer.addresses : null,
    });

    if (data.customer) {
      setNewCustomerFormData({
        name: data.customer.name,
        email: data.customer.email || '',
        phone: data.customer.phone || '',
      });
      if (data.customer.addresses && data.customer.addresses.length > 0) {
        setSelectedAddressId(data.customer.addresses[0].id || '');
        setDeliveryAddress(data.customer.addresses[0]);
      }
    } else {
      setDeliveryAddress(null);
      setSelectedAddressId('new');
    }

    setStep('customer-info');
    setIsLoading(false);
  };

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
            onCpfSearch={handleCpfSearch}
          />
        );
      case 'customer-info':
        return (
          <CustomerInfoStep
            customerData={customerData}
            newCustomerFormData={newCustomerFormData}
            setNewCustomerFormData={setNewCustomerFormData}
            onNext={handleNextStep}
          />
        );
      case 'order-details':
        return (
          <OrderDetailsStep
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            total={total}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 'address-info':
        return (
          <AddressInfoStep
            customerData={customerData}
            deliveryAddress={deliveryAddress}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            setDeliveryAddress={setDeliveryAddress}
            onPrevious={handlePreviousStep}
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
