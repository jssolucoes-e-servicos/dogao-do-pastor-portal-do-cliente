import React, { useState } from 'react';

export interface AddressData {
  street: string;
  number: string;
  neighborhood?: string | null;
  city: string;
  state: string;
  zipCode?: string | null;
  complement?: string | null;
  lat?: number;
  lng?: number;
}

interface AddressFormProps {
  onAddressChange: (address: AddressData | null) => void;
}

export function AddressForm({ onAddressChange }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressData>({
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
        <label htmlFor="street" className="block text-gray-700 font-bold mb-2">Rua</label>
        <input type="text" name="street" value={formData.street} onChange={handleChange} required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
      </div>
      <div>
        <label htmlFor="number" className="block text-gray-700 font-bold mb-2">Número</label>
        <input type="text" name="number" value={formData.number} onChange={handleChange} required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
      </div>
      <div>
        <label htmlFor="neighborhood" className="block text-gray-700 font-bold mb-2">Bairro</label>
        <input type="text" name="neighborhood" value={formData.neighborhood || ''} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-gray-700 font-bold mb-2">Cidade</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
        </div>
        <div>
          <label htmlFor="state" className="block text-gray-700 font-bold mb-2">Estado</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
        </div>
      </div>
      <div>
        <label htmlFor="zipCode" className="block text-gray-700 font-bold mb-2">CEP</label>
        <input type="text" name="zipCode" value={formData.zipCode || ''} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
      </div>
      <div>
        <label htmlFor="complement" className="block text-gray-700 font-bold mb-2">Complemento (Opcional)</label>
        <input type="text" name="complement" value={formData.complement || ''} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
      </div>
    </div>
  );
}
