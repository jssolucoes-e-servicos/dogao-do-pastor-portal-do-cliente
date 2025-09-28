// components/pre-sale/steps/order-details-step.tsx
'use client';
import HotDogModal from '@/components/modals/hotdog-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PRICE_PER_DOG } from '@/constants';
import { IPreOrderItem, PreOrderFindResponse } from '@/interfaces';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export function ItemsForm({ preorder }: { preorder: PreOrderFindResponse }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<IPreOrderItem[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const value = orderItems.length * PRICE_PER_DOG;
    setTotalValue(value);
  }, [orderItems]);

  const handleSaveCustomization = (removedIngredients: string[]) => {
    const newId = orderItems.length > 0 ? Math.max(...orderItems.map(item => item.id)) + 1 : 1;
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


  const handleProccessItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pre-sale-items/inserts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preOrderId: preorder.id, orderItems: orderItems }),
      });
      //const data = await response.json();
      //console.log('data:', data);
      if (!response.ok) {
        setIsLoading(false);
        toast({
          title: 'Erro',
          description: 'Falha ao gravar items, tente novamente.',
          variant: 'destructive',
        });
        //router.push("/off-line");
      } else {
        setIsLoading(false);
        router.push(`/pre-venda/${preorder.id}/endereco`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao buscar seus dados. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
      <h2 className="text-2xl font-bold text-center">Meus Dogões</h2>


      <div className="space-y-4">
        {orderItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Seu carrinho está vazio.</p>
          </div>
        ) : (
          orderItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-4">
                <Image src="/assets/images/hot-dog.svg" alt="Hot Dog" width={50} height={50} />
                <div>
                  <h4 className="font-semibold">{item.removedIngredients.length > 0 ? ("Dogão Personalizado") : ("Dogão Completo")} </h4>
                  <p className="text-sm text-gray-500">
                    {item.removedIngredients.length > 0 ? (`Sem: ${item.removedIngredients.join(', ')}`) : ""}
                  </p>

                </div>
              </div>
              <div className="flex items-center space-x-2 pl-2">
                <span className="font-semibold">R$ {PRICE_PER_DOG.toFixed(2)}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                  <Trash2 className="size-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
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
        className="w-full w-full bg-orange-600 hover:bg-orange-700"
        onClick={handleProccessItems}
        disabled={orderItems.length === 0 || isLoading}
      >
        {isLoading ? 'Salvando...' : 'Continuar'}
      </Button>
      <HotDogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomization}
      />
    </div>
  );
}
