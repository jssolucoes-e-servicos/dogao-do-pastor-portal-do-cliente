//components/pre-sale//steps/elements/type-delivery.tsx
"use client"
import { Input } from "@/components/ui/input";
import { ICustomerAddressFull, ICustomerFull } from "@/interfaces";
import { Dispatch, SetStateAction } from "react";

interface TypeDeliveryProps {
  customerId: string | undefined;
  addressData: Partial<ICustomerAddressFull>;
  showNewAddressForm: boolean;
  deliveryTime: string | null;
  handleDeliveriTymeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addressesList: ICustomerAddressFull[];
  setCustomerData: Dispatch<SetStateAction<ICustomerFull | undefined>>;
  setShowNewAddressForm: Dispatch<SetStateAction<boolean>>;
  setAddressData: Dispatch<SetStateAction<Partial<ICustomerAddressFull>>>;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TypeDelivery({ customerId, deliveryTime, handleDeliveriTymeChange, addressData, showNewAddressForm, addressesList, setShowNewAddressForm, setAddressData, setCustomerData, handleAddressChange }: TypeDeliveryProps) {


  const handleSavedAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'new') {
      setShowNewAddressForm(true);
      setAddressData({});
    } else {
      setShowNewAddressForm(false);
      const selectedAddress = addressesList?.find(addr => addr.id === selectedValue);
      if (selectedAddress) {
        setAddressData(selectedAddress);
      }
    }
  };


  return (
    <div className="space-y-4">
      {addressesList && addressesList.length > 0 && (
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
            {addressesList.map((address) => (
              <option key={address.id} value={address.id}>
                {`${address.street}, ${address.number} - ${address.neighborhood}`}
              </option>
            ))}
            <option value="new">Cadastrar novo endereço</option>
          </select>
        </div>
      )}

      {(showNewAddressForm || !addressesList || addressesList.length === 0) && (
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

        </>
      )}
      <Input
        type="time"
        name="deliveryTime"
        placeholder="Horário de entrega"
        value={deliveryTime || ''}
        onChange={handleDeliveriTymeChange}
      />
    </div>
  )
}
