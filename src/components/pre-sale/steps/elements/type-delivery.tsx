//components/pre-sale//steps/elements/type-delivery.tsx
"use client"
import { Input } from "@/components/ui/input";
import { IAddressData, IPreOrderCustomer } from "@/types/preOrderRequest";
import { Dispatch, SetStateAction } from "react";

interface TypeDeliveryProps {
  customerData: IPreOrderCustomer;
  addressData: Partial<IAddressData>;
  showNewAddressForm: boolean;
  setCustomerData: Dispatch<SetStateAction<IPreOrderCustomer>>;
  setShowNewAddressForm: Dispatch<SetStateAction<boolean>>;
  setAddressData: Dispatch<SetStateAction<Partial<IAddressData>>>;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TypeDelivery({ customerData, addressData, showNewAddressForm, setShowNewAddressForm, setAddressData, setCustomerData, handleAddressChange }: TypeDeliveryProps) {


  const handleSavedAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'new') {
      setShowNewAddressForm(true);
      setAddressData({});
      setCustomerData(prev => ({ ...prev, deliveryAddress: {} }));
    } else {
      setShowNewAddressForm(false);
      const selectedAddress = customerData.addresses?.find(addr => addr.id === selectedValue);
      if (selectedAddress) {
        setAddressData(selectedAddress);
        setCustomerData(prev => ({ ...prev, deliveryAddress: selectedAddress }));
      }
    }
  };


  return (
    <div className="space-y-4">
      {customerData.addresses && customerData.addresses.length > 0 && (
        <div className="space-y-2">
          <label htmlFor="saved-addresses" className="block text-sm font-medium text-gray-700">Escolha um endereço salvo:</label>
          <select
            id="saved-addresses"
            name="addressId"
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
            onChange={handleSavedAddressSelect}
            value={addressData.id || ''}
          >
            <option value="">Selecione um endereço</option>
            {customerData.addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {`${address.street}, ${address.number} - ${address.neighborhood}`}
              </option>
            ))}
            <option value="new">Cadastrar novo endereço</option>
          </select>
        </div>
      )}

      {(showNewAddressForm || !customerData.addresses || customerData.addresses.length === 0) && (
        <>
          <Input
            type="text"
            name="street"
            placeholder="Endereço (Rua, Av, etc.)"
            value={addressData.street || ''}
            onChange={handleAddressChange}
          />
          <Input
            type="text"
            name="number"
            placeholder="Número"
            value={addressData.number || ''}
            onChange={handleAddressChange}
          />
          <Input
            type="text"
            name="complement"
            placeholder="Complemento"
            value={addressData.complement || ''}
            onChange={handleAddressChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="neighborhood"
              placeholder="Bairro"
              value={addressData.neighborhood || ''}
              onChange={handleAddressChange}
            />
            <Input
              type="text"
              name="city"
              placeholder="Cidade"
              value={addressData.city || ''}
              onChange={handleAddressChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="state"
              placeholder="Estado (Ex: RS)"
              value={addressData.state || ''}
              onChange={handleAddressChange}
            />
            <Input
              type="text"
              name="zipCode"
              placeholder="CEP"
              value={addressData.zipCode || ''}
              onChange={handleAddressChange}
            />
          </div>
          <Input
            type="time"
            name="deliveryTime"
            placeholder="Horário de entrega"
            value={addressData.deliveryTime || ''}
            onChange={handleAddressChange}
          />
        </>
      )}
    </div>
  )
}
