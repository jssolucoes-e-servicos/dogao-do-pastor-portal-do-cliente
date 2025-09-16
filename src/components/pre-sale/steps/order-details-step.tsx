'use client';

import HotDogModal from '@/components/modals/hotdog-modal';
import { Button } from '@/components/ui/button';
import { IPreOrderItem } from '@/types/preOrder';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface OrderDetailsStepProps {
  orderItems: IPreOrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<IPreOrderItem[]>>;
  onNext: () => void;
  onPrevious: () => void;
}

export default function OrderDetailsStep({
  orderItems,
  setOrderItems,
  onNext,
  onPrevious,
}: OrderDetailsStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalValue = orderItems.length * 19.99;

  const handleSaveCustomization = (removedIngredients: string[]) => {
    const newId = orderItems.length > 0 ? Math.max(...orderItems.map(item => item.id!)) + 1 : 1;
    setOrderItems((prev: IPreOrderItem[]): IPreOrderItem[] => {
      const newItem: IPreOrderItem = {
        id: newId,
        removedIngredients,
      };
      return [...prev, newItem];
    });
  };

  const handleRemoveItem = (id: number) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Dogões</h3>
        <Button variant="ghost" onClick={onPrevious}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        {orderItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Seu carrinho está vazio.</p>
          </div>
        ) : (
          orderItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-4">
                <Image src="/hotdog.svg" alt="Hot Dog" width={50} height={50} />
                <div>
                  <h4 className="font-semibold">Dogão Personalizado</h4>
                  {item.removedIngredients.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Sem: {item.removedIngredients.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">R$ 19,99</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id!)}>
                  <Trash2 className="size-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
          <PlusCircle className="mr-2" />
          {orderItems.length === 0 ? 'Adicionar Dogão' : 'Adicionar outro Dogão'}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total:</span>
          <span>R$ {totalValue.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={onNext}
        disabled={orderItems.length === 0}
      >
        Continuar
      </Button>
      <HotDogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomization}
      />
    </div>
  );
}
