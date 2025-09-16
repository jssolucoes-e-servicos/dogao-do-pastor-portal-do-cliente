'use client';

import type { AddressData, CustomerFormData, FetchedCustomerData, FormStep } from '@/components/pre-sale/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { isValidCPF } from '@/helpers';
import React from 'react';

interface CpfSearchStepProps {
  cpf: string;
  setCpf: (cpf: string) => void;
  setIsLoading: (loading: boolean) => void;
  setCustomerData: (data: FetchedCustomerData | null) => void;
  setNewCustomerFormData: (data: CustomerFormData) => void;
  setSelectedAddressId: (id: string) => void;
  setDeliveryAddress: (address: AddressData | null) => void;
  setStep: (step: FormStep) => void;
  isLoading: boolean;
}

export default function CpfSearchStep({
  cpf,
  setCpf,
  setIsLoading,
  setCustomerData,
  setNewCustomerFormData,
  setSelectedAddressId,
  setDeliveryAddress,
  setStep,
  isLoading,
}: CpfSearchStepProps) {
  const { toast } = useToast();

  const handleCpfSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isValidCPF(cpf)) {
      toast({
        title: 'CPF inválido',
        description: 'Por favor, digite um CPF válido.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/find-by-cpf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf }),
      });

      const data = await response.json();

      if (response.ok && data) {
        setCustomerData({
          customer: data,
          addresses: data.addresses || null,
        });

        setNewCustomerFormData({
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
        });

        if (data.addresses && data.addresses.length > 0) {
          setSelectedAddressId(data.addresses[0].id || '');
          setDeliveryAddress(data.addresses[0]);
        }

        setStep('customer-info');

      } else {
        setCustomerData({ customer: null, addresses: null });
        setDeliveryAddress(null);
        setSelectedAddressId('new');
        toast({
          title: 'Novo Cliente',
          description: 'Não encontramos seu cadastro. Por favor, preencha seus dados para continuar.',
        });
        setStep('customer-info');
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao buscar seus dados. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCpfSearch} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Inicie seu Pedido</h2>
      <div>
        <Label htmlFor="cpf">Seu CPF</Label>
        <Input
          id="cpf"
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite apenas números"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={isLoading}
      >
        {isLoading ? 'Buscando...' : 'Iniciar Pedido'}
      </Button>
    </form>
  );
}
