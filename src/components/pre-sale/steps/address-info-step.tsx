import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Customer, AddressData, FetchedCustomerData } from '@/components/pre-sale';

interface AddressInfoStepProps {
  customerData: FetchedCustomerData | null;
  deliveryAddress: AddressData | null;
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  setDeliveryAddress: (address: AddressData | null) => void;
  onPrevious: () => void;
}

// Sub-componente para o formulário de endereço
const AddressForm = ({ initialData, onAddressChange }: { initialData?: AddressData | null, onAddressChange: (address: AddressData | null) => void }) => {
  const [formData, setFormData] = useState<AddressData>(initialData || {
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    complement: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    onAddressChange(newFormData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="street">Rua</Label>
        <Input type="text" name="street" value={formData.street} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="number">Número</Label>
        <Input type="text" name="number" value={formData.number} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input type="text" name="neighborhood" value={formData.neighborhood || ''} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="state">Estado</Label>
          <Input type="text" name="state" value={formData.state} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="zipCode">CEP</Label>
        <Input type="text" name="zipCode" value={formData.zipCode || ''} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="complement">Complemento (Opcional)</Label>
        <Input type="text" name="complement" value={formData.complement || ''} onChange={handleChange} />
      </div>
    </div>
  );
};

const AddressInfoStep: React.FC<AddressInfoStepProps> = ({
  customerData,
  deliveryAddress,
  selectedAddressId,
  setSelectedAddressId,
  setDeliveryAddress,
  onPrevious,
}) => {
  const handleAddressSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedAddressId(selectedId);
    if (selectedId === 'new') {
      setDeliveryAddress(null);
    } else {
      const selectedAddress = customerData?.addresses?.find(addr => addr.id === selectedId);
      if (selectedAddress) {
        setDeliveryAddress(selectedAddress);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryAddress) {
      console.log('Pedido finalizado com sucesso!');
      console.log('Endereço de entrega:', deliveryAddress);
    } else {
      console.error('Por favor, preencha o endereço de entrega.');
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Endereço de Entrega</h3>
        <Button variant="ghost" onClick={onPrevious}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Voltar
        </Button>
      </div>

      {customerData?.addresses && customerData.addresses.length > 0 ? (
        <div>
          <Label htmlFor="addressSelect">Selecione um Endereço Salvo</Label>
          <select
            id="addressSelect"
            value={selectedAddressId}
            onChange={handleAddressSelectionChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            <option value="">Selecione...</option>
            {customerData.addresses.map(addr => (
              <option key={addr.id} value={addr.id}>
                {`${addr.street}, ${addr.number} - ${addr.city}`}
              </option>
            ))}
            <option value="new">Adicionar Novo Endereço</option>
          </select>
        </div>
      ) : (
        <p className="text-gray-600">Por favor, adicione um endereço para a entrega.</p>
      )}

      {(selectedAddressId === 'new' || (customerData?.addresses?.length === 0 && selectedAddressId === '')) && (
        <div className="mt-4">
          <AddressForm onAddressChange={setDeliveryAddress} />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={!deliveryAddress}
      >
        Finalizar Pedido
      </Button>
    </form>
  );
};

export default AddressInfoStep;
