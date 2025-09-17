'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { IAddressData, IPreOrderCustomer, IPreOrderRequest } from '@/types/preOrderRequest';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

// Tipagem para o objeto google.maps que será carregado na janela do navegador
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options: AutocompleteOptions) => {
            addListener: (eventName: string, handler: () => void) => void;
            getPlace: () => PlaceResult;
          };
          AutocompleteOptions: {
            types: string[];
            componentRestrictions: { country: string };
          };
          PlaceResult: {
            address_components?: GeocoderAddressComponent[];
            formatted_address?: string;
          };
          GeocoderAddressComponent: {
            long_name: string;
            short_name: string;
            types: string[];
          };
        };
      };
    };
  }
}

interface AddressInfoStepProps {
  onNext: (data: Partial<IPreOrderRequest>) => void;
  onPrevious: () => void;
  customerData: IPreOrderCustomer;
  setCustomerData: Dispatch<SetStateAction<IPreOrderCustomer>>;
}

type DeliveryOption = 'pickup' | 'delivery' | 'donate';

export default function AddressInfoStep({ onNext, onPrevious, customerData, setCustomerData }: AddressInfoStepProps) {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('pickup');
  const inputRef = useRef<HTMLInputElement>(null);
  const [addressData, setAddressData] = useState<Partial<IAddressData>>(customerData.deliveryAddress || {});

  // useEffect para pré-preencher os dados do endereço caso já existam
  useEffect(() => {
    if (customerData.deliveryAddress) {
      setAddressData(customerData.deliveryAddress);
      setDeliveryOption('delivery'); // Select 'delivery' option if address data is present
    }
  }, [customerData]);

  // useEffect para inicializar o Autocomplete do Google Places
  useEffect(() => {
    // Verifica se a API do Google Maps foi carregada
    if (typeof window !== 'undefined' && window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'br' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          const newAddress: Partial<IAddressData> = {};
          place.address_components.forEach(component => {
            const types = component.types;
            if (types.includes('street_number')) newAddress.number = component.long_name;
            if (types.includes('route')) newAddress.street = component.long_name;
            if (types.includes('sublocality_level_1')) newAddress.neighborhood = component.long_name;
            if (types.includes('administrative_area_level_2')) newAddress.city = component.long_name;
            if (types.includes('administrative_area_level_1')) newAddress.state = component.short_name;
            if (types.includes('postal_code')) newAddress.zipCode = component.long_name;
          });
          setAddressData(newAddress);
          setCustomerData(prev => ({ ...prev, deliveryAddress: newAddress }));
        }
      });
    } else if (typeof window !== 'undefined' && !window.google) {
      toast({
        title: 'Erro ao carregar o mapa',
        description: 'A API do Google Maps não foi carregada corretamente. Por favor, recarregue a página.',
        variant: 'destructive',
      });
    }
  }, [setCustomerData, toast]);

  const handleNext = () => {
    if (deliveryOption === 'delivery' && (!addressData.street || !addressData.number || !addressData.zipCode)) {
      toast({
        title: 'Endereço incompleto',
        description: 'Por favor, preencha todos os campos do endereço.',
        variant: 'destructive',
      });
      return;
    }
    onNext({ customerData, deliveryAddress: addressData, deliveryOption });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
    setCustomerData(prev => ({ ...prev, deliveryAddress: { ...prev.deliveryAddress, [name]: value } }));
  };

  return (
    <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-2">Detalhes de Entrega</h2>
        <p className="text-gray-600 text-center">Selecione uma opção para o seu pedido.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
        <Button
          type="button"
          onClick={() => setDeliveryOption('pickup')}
          className={cn(
            "flex flex-col items-center justify-center p-4 h-auto w-full flex-1",
            deliveryOption === 'pickup' ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-black'
          )}
        >
          <Image
            src="/assets/images/hot-dog.svg"
            alt="Dogão para Retirada"
            width={60}
            height={60}
          />
          <span className="mt-2 text-center text-sm md:text-base whitespace-nowrap">Vou buscar</span>
        </Button>
        <Button
          type="button"
          onClick={() => setDeliveryOption('delivery')}
          className={cn(
            "flex flex-col items-center justify-center p-4 h-auto w-full flex-1",
            deliveryOption === 'delivery' ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-black'
          )}
        >
          <Image
            src="/assets/images/hot-dog.svg"
            alt="Dogão para Entrega"
            width={60}
            height={60}
          />
          <span className="mt-2 text-center text-sm md:text-base whitespace-nowrap">Quero receber</span>
        </Button>
        <Button
          type="button"
          onClick={() => setDeliveryOption('donate')}
          className={cn(
            "flex flex-col items-center justify-center p-4 h-auto w-full flex-1",
            deliveryOption === 'donate' ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-black'
          )}
        >
          <Image
            src="/assets/images/hot-dog.svg"
            alt="Dogão para Doação"
            width={60}
            height={60}
          />
          <span className="mt-2 text-center text-sm md:text-base whitespace-nowrap">Pode doar</span>
        </Button>
      </div>

      {deliveryOption === 'delivery' && (
        <div className="space-y-4">
          <Input
            ref={inputRef}
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
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Voltar
        </Button>
        <Button type="button" onClick={handleNext}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
