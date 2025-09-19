// components/pre-sale/steps/customer-info-step.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { ICustomerFullWithAddress } from '@/interfaces';
import { PencilIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Tipagem para os dados do cliente que serão enviados para a API
interface IProcessCustomerPayload {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  knowsChurch?: boolean;
  allowsChurch?: boolean;
}

interface CustomerInfoStepProps {
  cpf: string;
  customer: ICustomerFullWithAddress | null;
  setCustomer: (data: ICustomerFullWithAddress | null) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function CustomerInfoStep({ cpf, customer, setCustomer, onNext, onPrevious }: CustomerInfoStepProps) {
  const { toast } = useToast();
  const [isFormEditable, setIsFormEditable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerFormData, setCustomerFormData] = useState<IProcessCustomerPayload>({
    name: '',
    email: '',
    phone: '',
    cpf,
    knowsChurch: false,
    allowsChurch: false,
  });

  // Preenche o formulário com os dados existentes, se houver
  useEffect(() => {
    if (customer) {
      setCustomerFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        cpf: customer.cpf,
        knowsChurch: customer.knowsChurch,
        allowsChurch: customer.allowsChurch,
      });
    } else {
      // Se não há dados, o formulário já está em modo de edição
      setIsFormEditable(true);
    }
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof IProcessCustomerPayload, checked: boolean) => {
    setCustomerFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleProcessEntry = async () => {
    const missingFields = [];
    if (!customerFormData.name) missingFields.push('Nome');
    if (!customerFormData.phone) missingFields.push('Telefone');

    if (missingFields.length > 0) {
      toast({
        title: 'Campos incompletos',
        description: `Por favor, preencha os seguintes campos: ${missingFields.join(', ')}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        ...customerFormData,
        // Adiciona o ID se for uma edição de cliente existente
        ...(customer?.id && { id: customer.id }),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/proccess-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const processedCustomer: ICustomerFullWithAddress | null = await response.json();
      if (!response.ok || processedCustomer === null) {
        throw new Error('Erro ao salvar os dados do cliente.');
      }
      setCustomer(processedCustomer);
      onNext();
    } catch (err: any) {
      console.error('Erro na requisição:', err);
      toast({
        title: 'Erro ao salvar',
        description: err.message || 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderForm = () => (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Nome Completo<span className="text-red-500">*</span></Label>
        <Input
          id="name"
          placeholder="Nome Completo"
          name="name"
          value={customerFormData.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email"
          name="email"
          type="email"
          value={customerFormData.email}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefone<span className="text-red-500">*</span></Label>
        <Input
          id="phone"
          placeholder="Telefone"
          name="phone"
          value={customerFormData.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="knows-church"
          checked={customerFormData.knowsChurch}
          onCheckedChange={(checked) => handleSwitchChange('knowsChurch', checked)}
        />
        <Label htmlFor="knows-church">Conhece a IVC?</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="allows-church"
          checked={customerFormData.allowsChurch}
          onCheckedChange={(checked) => handleSwitchChange('allowsChurch', checked)}
        />
        <Label htmlFor="allows-church">Aceito receber mensagens?</Label>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="p-4 rounded-md bg-gray-100 relative">
      <p className="text-lg font-bold">Olá, {customer?.name}!</p>
      <p>Email: {customer?.email || '-'}</p>
      <p>Telefone: {customer?.phone || '-'}</p>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
        onClick={() => setIsFormEditable(true)}
      >
        <PencilIcon className="h-4 w-4 mr-2" />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
      <div className="flex justify-start items-center mb-4">
        <Button type="button" variant="ghost" onClick={onPrevious}>
          Voltar
        </Button>
      </div>
      <h2 className="text-2xl font-bold text-center">Confirme seus dados</h2>
      {!isFormEditable && customer ? renderSummary() : renderForm()}
      <Button onClick={handleProcessEntry} disabled={isProcessing} className="w-full">
        {isProcessing ? 'Salvando...' : 'Avançar para o endereço'}
      </Button>
    </div>
  );
}
