'use client';

import {
  PreOrderItemState
} from '@/components/pre-sale/index';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { _INGREDIENTS } from '@/constants';
import { useState } from 'react';

interface HotDogCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (removedIngredients: string[]) => void;
}

const HotDogCustomizer = ({ isOpen, onClose, onSave }: HotDogCustomizerProps) => {
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const handleCheckboxChange = (ingredient: string) => {
    setRemovedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleSave = () => {
    onSave(removedIngredients);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personalizar Dogão</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Selecione os ingredientes que você deseja **remover**:</p>
          {_INGREDIENTS.map(ingredient => (
            <div key={ingredient} className="flex items-center space-x-2">
              <Checkbox
                id={ingredient}
                checked={removedIngredients.includes(ingredient)}
                onCheckedChange={() => handleCheckboxChange(ingredient)}
              />
              <Label htmlFor={ingredient}>{ingredient}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface OrderDetailsStepProps {
  orderItems: PreOrderItemState[];
  setOrderItems: (items: PreOrderItemState[]) => void;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function OrderDetailsStep({
  orderItems,
  setOrderItems,
  total,
  onNext,
  onPrevious,
}: OrderDetailsStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddHotDog = () => {
    setIsModalOpen(true);
  };

  const handleSaveCustomization = (removedIngredients: string[]) => {
    const newId = orderItems.length > 0 ? Math.max(...orderItems.map(item => item.id)) + 1 : 1;
    setOrderItems(prev => [...prev, { id: newId, removedIngredients }]);
  };

  const handleRemoveItem = (id: number) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Dogão(s) no seu Pedido</h3>
        <Button variant="ghost" onClick={onPrevious}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        {orderItems.length === 0 ? (
          <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          orderItems.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-inner">
              <div className="flex-1">
                <p className="font-semibold">Dogão #{index + 1}</p>
                {item.removedIngredients.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Sem: {item.removedIngredients.join(', ')}
                  </p>
                )}
              </div>
              <Button variant="ghost" onClick={() => handleRemoveItem(item.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.36L16.5 4.5m-1.74-1.74L16.5 4.5m-7.5 7.5V6a3.75 3.75 0 0 0-7.5 0v3.75M9 12h6" />
                </svg>
              </Button>
            </div>
          ))
        )}
      </div>

      <Button
        onClick={handleAddHotDog}
        className="w-full bg-orange-600 hover:bg-orange-700"
      >
        {orderItems.length > 0 ? 'Adicionar outro Dogão' : 'Adicionar Dogão'}
      </Button>

      <HotDogCustomizer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomization}
      />

      <div className="text-right font-bold text-lg">
        Total: {formatPrice(total)}
      </div>

      <Button
        onClick={onNext}
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={orderItems.length === 0}
      >
        Continuar para o Endereço
      </Button>
    </div>
  );
}
