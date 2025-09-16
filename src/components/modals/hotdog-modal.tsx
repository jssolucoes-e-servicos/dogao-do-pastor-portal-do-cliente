'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { _INGREDIENTS } from '@/constants';
import { useState } from 'react';

interface HotDogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (removedIngredients: string[]) => void;
}

export default function HotDogModal({ isOpen, onClose, onSave }: HotDogModalProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const handleCheckboxChange = (ingredient: string) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((item) => item !== ingredient)
        : [...prevSelected, ingredient]
    );
  };

  const handleSave = () => {
    const removedIngredients = _INGREDIENTS.filter(
      (ingredient) => !selectedIngredients.includes(ingredient)
    );
    onSave(removedIngredients);
    onClose();
    setSelectedIngredients([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalize seu Dogão</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h4 className="text-lg font-semibold">Escolha os ingredientes que você quer</h4>
          <div className="grid grid-cols-2 gap-2">
            {_INGREDIENTS.map((ingredient) => (
              <div key={ingredient} className="flex items-center space-x-2">
                <Checkbox
                  id={ingredient}
                  checked={selectedIngredients.includes(ingredient)}
                  onCheckedChange={() => handleCheckboxChange(ingredient)}
                />
                <label htmlFor={ingredient} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {ingredient}
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
