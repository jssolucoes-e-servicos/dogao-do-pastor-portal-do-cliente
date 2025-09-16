// components/PreSaleForm/CustomerInfoStep.tsx

import { isValidPhoneNumber } from '@/helpers';
import React from 'react';
import type { CustomerFormData, FetchedCustomerData } from './index';

interface CustomerInfoStepProps {
  customerData: FetchedCustomerData | null;
  newCustomerFormData: CustomerFormData;
  setNewCustomerFormData: (data: CustomerFormData) => void;
  onNext: () => void;
}

export function CustomerInfoStep({
  customerData,
  newCustomerFormData,
  setNewCustomerFormData,
  onNext,
}: CustomerInfoStepProps) {
  const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomerFormData({ ...newCustomerFormData, [name]: value });
  };

  const handleNext = () => {
    if (!newCustomerFormData.name || !isValidPhoneNumber(newCustomerFormData.phone)) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onNext();
  };

  return (
    <>
      <h3 className="text-xl font-bold mb-4">Dados de Cadastro</h3>
      {!customerData?.customer && (
        <p className="text-lg font-bold mb-4">Você é um novo cliente! Por favor, complete seu cadastro.</p>
      )}
      {customerData?.customer && (
        <p className="text-lg font-bold mb-4">Olá, {customerData.customer.name}!</p>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nome Completo</label>
        <input type="text" name="name" value={newCustomerFormData.name} onChange={handleNewCustomerChange} required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">E-mail (Opcional)</label>
        <input type="email" name="email" value={newCustomerFormData.email} onChange={handleNewCustomerChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Telefone (WhatsApp)</label>
        <input
          type="tel"
          name="phone"
          value={newCustomerFormData.phone}
          onChange={handleNewCustomerChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
          placeholder="Ex: 51987654321"
        />
        {!isValidPhoneNumber(newCustomerFormData.phone) && newCustomerFormData.phone.length > 0 && (
          <p className="text-red-500 text-sm mt-1">Por favor, insira um telefone válido com DDD.</p>
        )}
      </div>
      <button type="button" onClick={handleNext}
        className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
        Avançar
      </button>
    </>
  );
}