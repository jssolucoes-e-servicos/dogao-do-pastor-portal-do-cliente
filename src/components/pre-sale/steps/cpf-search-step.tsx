// components/pre-sale/steps/cpf-search-step.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { isValidCPF } from '@/helpers';
import { ICustomerFullWithAddress } from '@/interfaces';
import { PreOrderFormStep } from '@/types';
import React from 'react';

interface CpfSearchStepProps {
  cpf: string;
  setCpf: (cpf: string) => void;
  setIsLoading: (loading: boolean) => void;
  setCustomer: (data: ICustomerFullWithAddress | null) => void;
  /* setDeliveryAddress: (address: ICustomerAddressFull | null) => void;
  setSelectedAddressId: (id: string) => void; */
  setStep: (step: PreOrderFormStep) => void;
  isLoading: boolean;
}

export default function CpfSearchStep({
  cpf,
  setCpf,
  setIsLoading,
  setCustomer,
  /* setDeliveryAddress,
  setSelectedAddressId, */
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

      const data: ICustomerFullWithAddress = await response.json();
      if (response.ok && data) {
        setCustomer(data);

        /*  if (data.addresses && data.addresses.length > 0) {
           setSelectedAddressId(data.addresses[0].id || '');
           setDeliveryAddress(data.addresses[0]);
         } */

        setStep('customer-info');
      } else {
        setCustomer(null);
        /*  setDeliveryAddress(null);
         setSelectedAddressId(''); */
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
        <Label htmlFor="cpf" className='pb-2'>Seu CPF</Label>
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
