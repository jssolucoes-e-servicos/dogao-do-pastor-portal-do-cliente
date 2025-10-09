//components/pre-sale//steps/elements/type-delivery.tsx
"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICustomerAddressFull } from "@/interfaces";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";


interface TypeDeliveryProps {
    showNewAddressForm: boolean;
    deliveryTime: string | null;
    handleDeliveriTymeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    addressesList: ICustomerAddressFull[];
    setShowNewAddressForm: Dispatch<SetStateAction<boolean>>;
    addressData: Partial<ICustomerAddressFull>;
    setAddressData: Dispatch<SetStateAction<Partial<ICustomerAddressFull>>>;
    setAddressSelected: Dispatch<SetStateAction<Partial<ICustomerAddressFull> | null>>;
    handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TypeDelivery({ deliveryTime, handleDeliveriTymeChange, addressData, showNewAddressForm, addressesList, setShowNewAddressForm, setAddressData,setAddressSelected, handleAddressChange }: TypeDeliveryProps) {
    const streetInputRef = useRef<HTMLInputElement>(null);

    const initAutocomplete = useCallback(async () => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        // CRÍTICO: Certifica-se de que a chave API e a referência do input existem
        if (!apiKey || !streetInputRef.current) {
            console.error("API Key ou streetInputRef ausente. Autocomplete não será inicializado.");
            return;
        }

        try {
            setOptions({
                key: apiKey,
                v: "weekly",
            });

            // Importa a biblioteca 'places' dinamicamente
            const { Autocomplete } = await importLibrary('places') as google.maps.PlacesLibrary;

            // Cria a instância do Autocomplete e anexa ao input de rua
            const autocomplete = new Autocomplete(streetInputRef.current, {
                types: ['address'], 
                componentRestrictions: { country: 'br' },
            });

            // Adiciona o listener para preencher o formulário
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.address_components) {

                    const newAddress: Partial<ICustomerAddressFull> = {};
                    let streetName = '';
                    let streetNumber = '';

                    for (const component of place.address_components) {
                        const type = component.types[0];
                        switch (type) {
                            case 'street_number':
                                streetNumber = component.long_name;
                                break;
                            case 'route':
                                streetName = component.long_name;
                                break;
                            // Lógica de mapeamento para o Bairro
                            // Inclui 'sublocality_level_1', 'sublocality' e 'neighborhood'
                            case 'sublocality_level_1':
                            case 'sublocality_level_2': 
                            case 'sublocality':
                            case 'neighborhood':
                                // Prioriza o primeiro bairro encontrado (se houver mais de um tipo)
                                if (!newAddress.neighborhood) { 
                                    newAddress.neighborhood = component.long_name;
                                }
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
                        
                    newAddress.street = streetName;
                    newAddress.number = streetNumber;
                    
                    setAddressData(prev => ({ ...prev, ...newAddress }));
                }
            });
        } catch (error) {
            console.error("Erro ao carregar Google Maps API:", error);
        }
    }, [setAddressData]); 

    useEffect(() => {
        if (showNewAddressForm || !addressesList || addressesList.length === 0) {
            initAutocomplete();
        }
    }, [showNewAddressForm, addressesList, initAutocomplete]);


    const handleSavedAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'new') {
            setShowNewAddressForm(true);
            setAddressData({});
            setAddressSelected(null);
        } else {
            setShowNewAddressForm(false);
            const selectedAddress = addressesList?.find(addr => addr.id === selectedValue);
            if (selectedAddress) {
                setAddressData(selectedAddress);
                setAddressSelected(selectedAddress)
            }
        }
    };


    return (
        <div className="space-y-4">
            {addressesList && addressesList.length > 0 && (
                <div className="space-y-2">
                    <Label htmlFor="saved-addresses" className="block text-sm font-medium text-gray-700">Escolha um endereço salvo:</Label>
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
                        ref={streetInputRef} 
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
            <div className="flex gap-4">
              <Label
                className="text-sm font-medium text-gray-700">
                Informe um horário aproximado entre 10 h e 21h30min
              </Label>
              <Input
                className="flex-1"
                type="time"
                name="deliveryTime"
                required
                placeholder="Horário de entrega"
                value={deliveryTime || ''}
                onChange={handleDeliveriTymeChange}
              />
            </div>
            
        </div>
    )
}