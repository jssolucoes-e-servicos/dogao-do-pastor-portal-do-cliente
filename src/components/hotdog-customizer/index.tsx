'use client';

import { _INGREDIENTS } from '@/constants';
import { IHotDogCustomizer } from '@/interfaces';
import { useState } from 'react';

export function HotDogCustomizer({ initialRemovedIngredients = [], onIngredientsChange }: IHotDogCustomizer) {
  const [removedIngredients, setRemovedIngredients] = useState<string[]>(initialRemovedIngredients);

  const handleIngredientToggle = (ingredient: string) => {
    const isRemoved = removedIngredients.includes(ingredient);

    const updatedIngredients = isRemoved
      ? removedIngredients.filter((item) => item !== ingredient)
      : [...removedIngredients, ingredient];

    setRemovedIngredients(updatedIngredients);
    onIngredientsChange(updatedIngredients);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold mb-4 text-center">Personalize seu Dogão</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        {_INGREDIENTS.map((ingredient: string) => (
          <div
            key={ingredient}
            className={`p-2 rounded-lg cursor-pointer transition-colors border-2
              ${removedIngredients.includes(ingredient)
                ? 'bg-red-200 border-red-500 line-through'
                : 'bg-green-200 border-green-500'}`
            }
            onClick={() => handleIngredientToggle(ingredient)}
          >
            {ingredient}
          </div>
        ))}
      </div>
    </div>
  );
}