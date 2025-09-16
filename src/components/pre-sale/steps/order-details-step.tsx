import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PreOrderItemState } from '@/components/pre-sale';

interface OrderDetailsStepProps {
  orderItems: PreOrderItemState[];
  setOrderItems: React.Dispatch<React.SetStateAction<PreOrderItemState[]>>;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}

const ALL_INGREDIENTS = ['Queijo', 'Batata Palha', 'Maionese', 'Milho', 'Ervilha', 'Tomate', 'Cebola'];

// Componente interno para a personalização
const HotDogCustomizer = ({ initialRemovedIngredients, onIngredientsChange }) => {
  const [removedIngredients, setRemovedIngredients] = useState(initialRemovedIngredients);

  const handleToggleIngredient = (ingredient: string) => {
    const isRemoved = removedIngredients.includes(ingredient);
    let newRemovedList: string[];
    if (isRemoved) {
      newRemovedList = removedIngredients.filter(item => item !== ingredient);
    } else {
      newRemovedList = [...removedIngredients, ingredient];
    }
    setRemovedIngredients(newRemovedList);
    onIngredientsChange(newRemovedList);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {ALL_INGREDIENTS.map(ingredient => {
        const isRemoved = removedIngredients.includes(ingredient);
        return (
          <Button
            key={ingredient}
            type="button"
            onClick={() => handleToggleIngredient(ingredient)}
            variant="outline"
            className={`text-sm transition-colors ${isRemoved ? 'bg-red-100 text-red-800 border-red-300' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`}
          >
            {isRemoved ? 'Sem ' : ''}{ingredient}
          </Button>
        );
      })}
    </div>
  );
};

const OrderDetailsStep: React.FC<OrderDetailsStepProps> = ({
  orderItems,
  setOrderItems,
  total,
  onNext,
  onPrevious,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [tempIngredients, setTempIngredients] = useState<string[]>([]);

  const addOrUpdateHotDog = () => {
    if (editingItemId !== null) {
      setOrderItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItemId ? { ...item, removedIngredients: tempIngredients } : item
        )
      );
    } else {
      setOrderItems(prevItems => [
        ...prevItems,
        { id: Date.now(), removedIngredients: tempIngredients },
      ]);
    }
    closeModal();
  };

  const removeHotDog = (idToRemove: number) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
  };

  const openModal = (itemId: number | null = null) => {
    setEditingItemId(itemId);
    const initialIngredients = itemId !== null ? (orderItems.find(item => item.id === itemId)?.removedIngredients || []) : [];
    setTempIngredients(initialIngredients);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItemId(null);
    setTempIngredients([]);
  };

  const handleNext = () => {
    if (orderItems.length === 0) {
      console.error('Por favor, adicione pelo menos um Dogão ao seu pedido.');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Seu Pedido</h3>
        <Button variant="ghost" onClick={onPrevious}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        {orderItems.map((item, index) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-lg">Dogão #{index + 1}</h4>
              <div className="space-x-2">
                <Button variant="link" onClick={() => openModal(item.id)}>Editar</Button>
                <Button variant="link" onClick={() => removeHotDog(item.id)} className="text-red-500 hover:text-red-700">Remover</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              {item.removedIngredients.length > 0 ? (
                item.removedIngredients.map((ing, i) => (
                  <span key={i} className="bg-red-200 text-red-800 rounded-full px-2 py-1">Sem {ing}</span>
                ))
              ) : (
                <span>Dogão completo!</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-lg font-bold text-center mt-6">Total: R$ {total.toFixed(2).replace('.', ',')}</p>
      <Button
        type="button"
        onClick={() => openModal()}
        variant="secondary"
        className="w-full"
      >
        Adicionar outro Dogão
      </Button>
      <Button
        type="button"
        onClick={handleNext}
        className="w-full bg-orange-600 hover:bg-orange-700"
      >
        Avançar
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Personalizar Dogão</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-sm text-center mb-6">Clique nos ingredientes para remover</p>
            <HotDogCustomizer initialRemovedIngredients={tempIngredients} onIngredientsChange={setTempIngredients} />
          </div>
          <Button
            onClick={addOrUpdateHotDog}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {editingItemId !== null ? 'Salvar Edição' : 'Adicionar ao Pedido'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetailsStep;
