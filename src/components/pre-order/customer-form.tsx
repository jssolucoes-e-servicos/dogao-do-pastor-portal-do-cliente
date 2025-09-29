"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ICustomerFullWithAddress, PreOrderFindInitialResponse } from "@/interfaces";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

interface IProcessCustomerPayload {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  knowsChurch?: boolean;
  allowsChurch?: boolean;
  presaleId?: string | null;
}

export function PreOrderCustomerForm({ preorder }: { preorder: PreOrderFindInitialResponse }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormEditable, setIsFormEditable] = useState<boolean>(false);
  const [customerFormData, setCustomerFormData] = useState<IProcessCustomerPayload>({
    name: '',
    email: '',
    phone: '',
    cpf: preorder.observations,
    knowsChurch: false,
    allowsChurch: false,
    presaleId: null,
  });

  useEffect(() => {
    if (preorder.customer) {
      setCustomerFormData({
        name: preorder.customer.name,
        email: preorder.customer.email || '',
        phone: preorder.customer.phone || '',
        cpf: preorder.observations,
        knowsChurch: preorder.customer.knowsChurch,
        allowsChurch: preorder.customer.allowsChurch,
      });
    } else {
      // Se não há dados, o formulário já está em modo de edição
      setIsFormEditable(true);
    }
  }, [preorder]);

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
      toast.error(`Por favor, preencha os seguintes campos: ${missingFields.join(', ')}.`);
      return;
    }

    setIsLoading(true);
    try {
      customerFormData.presaleId = preorder.id;
      const payload = {
        ...customerFormData,
        // Adiciona o ID se for uma edição de cliente existente
        ...(preorder.customer?.id && { id: preorder.customer.id }),
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
      router.push(`/pre-venda/${preorder.id}/pedido`)
    } catch (err) {
      console.error('Erro na requisição:', err);
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };


  const renderSummary = () => (
    <div className="p-4 rounded-md bg-gray-100 relative">
      <p className="text-lg font-bold">Olá, {preorder.customer?.name}!</p>
      <p>Email: {preorder.customer?.email || '-'}</p>
      <p>Telefone: {preorder.customer?.phone || '-'}</p>
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

  return (
    <Fragment>
      <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
        <h2 className="text-2xl font-bold text-center">Confirme seus dados</h2>
        {!isFormEditable && preorder.customer ? renderSummary() : renderForm()}
        <Button onClick={handleProcessEntry} disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-700">
          {isLoading ? 'Salvando...' : 'Montar pedido'}
        </Button>
      </div>
    </Fragment>
  );
}