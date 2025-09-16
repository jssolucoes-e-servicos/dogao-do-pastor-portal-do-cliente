'use client';

import React, { useEffect, useRef } from 'react';

// Tipagem básica para os dados de endereço
export interface AddressData {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    complement: string;
}

interface AddressFormProps {
    initialData?: AddressData;
    onAddressChange: (address: AddressData) => void;
}

export function AddressForm({ initialData, onAddressChange }: AddressFormProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [address, setAddress] = React.useState<AddressData>(initialData || {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        complement: '',
    });

    useEffect(() => {
        // Carrega o script da API do Google Maps
        const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!googleMapsApiKey) return;

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&language=pt-BR`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            // Inicia o serviço de autocompletar
            if (inputRef.current) {
                const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                    types: ['address'],
                    componentRestrictions: { country: 'br' },
                });

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place.address_components) {
                        const newAddress: Partial<AddressData> = {};
                        for (const component of place.address_components) {
                            const type = component.types[0];
                            switch (type) {
                                case 'route':
                                    newAddress.street = component.long_name;
                                    break;
                                case 'sublocality_level_1':
                                    newAddress.neighborhood = component.long_name;
                                    break;
                                case 'administrative_area_level_2':
                                    newAddress.city = component.long_name;
                                    break;
                                case 'administrative_area_level_1':
                                    newAddress.state = component.short_name;
                                    break;
                                case 'postal_code':
                                    newAddress.zipCode = component.long_name;
                                    break;
                            }
                        }
                        setAddress((prev) => ({ ...prev, ...newAddress }));
                        onAddressChange({ ...address, ...newAddress } as AddressData);
                    }
                });
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        onAddressChange({ ...address, [name]: value });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold">Endereço de Entrega</h3>

            <div>
                <label htmlFor="street" className="block text-gray-700 font-bold mb-1">Rua</label>
                <input type="text" id="street" name="street" ref={inputRef} value={address.street} onChange={handleChange} required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Comece a digitar o endereço..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="number" className="block text-gray-700 font-bold mb-1">Número</label>
                    <input type="text" id="number" name="number" value={address.number} onChange={handleChange} required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                </div>
                <div>
                    <label htmlFor="complement" className="block text-gray-700 font-bold mb-1">Complemento (opcional)</label>
                    <input type="text" id="complement" name="complement" value={address.complement} onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                </div>
            </div>

            <div>
                <label htmlFor="neighborhood" className="block text-gray-700 font-bold mb-1">Bairro</label>
                <input type="text" id="neighborhood" name="neighborhood" value={address.neighborhood} onChange={handleChange} required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="city" className="block text-gray-700 font-bold mb-1">Cidade</label>
                    <input type="text" id="city" name="city" value={address.city} onChange={handleChange} required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                </div>
                <div>
                    <label htmlFor="state" className="block text-gray-700 font-bold mb-1">Estado</label>
                    <input type="text" id="state" name="state" value={address.state} onChange={handleChange} required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                </div>
            </div>

            <div>
                <label htmlFor="zipCode" className="block text-gray-700 font-bold mb-1">CEP</label>
                <input type="text" id="zipCode" name="zipCode" value={address.zipCode} onChange={handleChange} required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
            </div>

        </div>
    );
}