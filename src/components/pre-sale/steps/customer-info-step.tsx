'use client';
import { CustomerFormData, FetchedCustomerData } from '@/components/pre-sale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerInfoStepProps {
  customerData: FetchedCustomerData | null;
  newCustomerFormData: CustomerFormData;
  setNewCustomerFormData: (data: CustomerFormData) => void;
  onNext: () => void;
}

const isValidPhoneNumber = (phone: string): boolean => {
  return /^\d{11,13}$/.test(phone);
};

const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  customerData,
  newCustomerFormData,
  setNewCustomerFormData,
  onNext,
}) => {
  const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomerFormData({ ...newCustomerFormData, [name]: value });
  };

  const handleNext = () => {
    if (!newCustomerFormData.name || !isValidPhoneNumber(newCustomerFormData.phone)) {
      console.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Dados de Cadastro</h3>
      {!customerData?.customer && (
        <p className="text-lg font-bold">Você é um novo cliente! Por favor, complete seu cadastro.</p>
      )}
      {customerData?.customer && (
        <p className="text-lg font-bold">Olá, {customerData.customer.name}!</p>
      )}

      <div>
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" type="text" name="name" value={newCustomerFormData.name} onChange={handleNewCustomerChange} required />
      </div>
      <div>
        <Label htmlFor="email">E-mail (Opcional)</Label>
        <Input id="email" type="email" name="email" value={newCustomerFormData.email} onChange={handleNewCustomerChange} />
      </div>
      <div>
        <Label htmlFor="phone">Telefone (WhatsApp)</Label>
        <Input
          id="phone"
          type="tel"
          name="phone"
          value={newCustomerFormData.phone}
          onChange={handleNewCustomerChange}
          required
          placeholder="Ex: 51987654321"
        />
        {!isValidPhoneNumber(newCustomerFormData.phone) && newCustomerFormData.phone.length > 0 && (
          <p className="text-red-500 text-sm mt-1">Por favor, insira um telefone válido com DDD.</p>
        )}
      </div>
      <Button type="button" onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-700">
        Avançar
      </Button>
    </div>
  );
};

export default CustomerInfoStep;
