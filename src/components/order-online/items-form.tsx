// components/pre-sale/steps/order-details-step.tsx
'use client';
import HotDogModal from '@/components/modals/hotdog-modal';
import { Button } from '@/components/ui/button';
import { PRICE_PER_DOG } from '@/constants';
import { IOrderItemSend, IOrderOnline } from '@/interfaces';
import { PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

import { formatCurrency } from '@/lib/formats';
import { useEffect, useMemo, useState } from 'react';


// Interface para o agrupamento visual no frontend (NÃO é o estado)
interface IGroupedItem extends IOrderItemSend {
  quantity: number;
  groupId: string; // Chave única para o grupo (baseada na personalização)
  firstItemId: number; // ID do primeiro item do grupo para remoção
}

// Função para agrupar os itens para visualização (o truque!)
const groupItems = (items: IOrderItemSend[]): IGroupedItem[] => {
  const groups = new Map<string, IGroupedItem>();

  items.forEach((item) => {
    // Cria uma chave única baseada nos ingredientes removidos
    const key = item.removedIngredients.sort().join('|');

    if (groups.has(key)) {
      const group = groups.get(key)!;
      group.quantity += 1;
    } else {
      groups.set(key, {
        ...item,
        quantity: 1,
        groupId: key,
        firstItemId: item.id, // Guarda o ID do primeiro item do grupo
      });
    }
  });

  return Array.from(groups.values());
};

export function ItemsForm({ preorder }: { preorder: IOrderOnline }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<IOrderItemSend[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const value = orderItems.length * PRICE_PER_DOG;
    setTotalValue(value);
  }, [orderItems]);

  // Cria a lista agrupada (memoizada para performance)
  const groupedItems = useMemo(() => groupItems(orderItems), [orderItems]);

  const handleSaveCustomization = (removedIngredients: string[]) => {
    const newId = orderItems.length > 0 ? Math.max(...orderItems.map(item => item.id)) + 1 : 1;
    setOrderItems((prev: IOrderItemSend[]): IOrderItemSend[] => {
      const newItem: IOrderItemSend = {
        id: newId,
        removedIngredients,
      };
      return [...prev, newItem];
    });
  };

  // Lógica de Incremento: Adiciona uma CÓPIA do item
  const handleIncrement = (groupId: string) => {
    const groupToCopy = groupedItems.find(g => g.groupId === groupId);
    if (!groupToCopy) return;

    // Cria um novo item com o mesmo tipo de personalização
    const newId = orderItems.length > 0 ? Math.max(...orderItems.map(item => item.id)) + 1 : 1;
    const newItem: IOrderItemSend = {
      id: newId,
      removedIngredients: groupToCopy.removedIngredients,
    };

    // Adiciona o novo item ao array plano
    setOrderItems(prev => [...prev, newItem]);
  };

  // Lógica de Decremento: Remove o ÚLTIMO item com essa personalização
  const handleDecrement = (groupId: string) => {
    const groupToDecrement = groupedItems.find(g => g.groupId === groupId);
    if (!groupToDecrement || groupToDecrement.quantity <= 0) return;

    setOrderItems(prev => {
      let indexToRemove = -1;
      for(let i = prev.length - 1; i >= 0; i--) {
        const currentItem = prev[i];
        const currentKey = currentItem.removedIngredients.sort().join('|');
        if (currentKey === groupId) {
          indexToRemove = i;
          break;
        }
      }

      if (indexToRemove === -1) return prev; // Não encontrado

      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleRemoveGroup = (groupId: string) => {
    setOrderItems(prev => prev.filter(item => {
      const itemKey = item.removedIngredients.sort().join('|');
      return itemKey !== groupId;
    }));
  };

  const handleProccessItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online-items/inserts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderOnlineId: preorder.id, orderItems: orderItems }),
      });
      if (!response.ok) {
        setIsLoading(false);
        toast.error('Falha ao gravar items, tente novamente.');
      } else {
        router.push(`/comprar/${preorder.id}/endereco`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Ocorreu um erro ao buscar seus dados. Tente novamente.');
       setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 rounded-lg bg-white shadow-lg w-full">
      <h2 className="text-2xl font-bold text-center">Meus Dogões</h2>

      <div className="space-y-4">
        {groupedItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Seu carrinho está vazio.</p>
          </div>
        ) : (
          // Usamos groupedItems (a lista para visualização) para renderizar
          groupedItems.map(item => ( 
            <div key={item.groupId} className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center space-x-4">
                <Image src="/assets/images/hot-dog.svg" alt="Hot Dog" width={50} height={50} />
                <div>
                  <h4 className="font-semibold">{item.removedIngredients.length > 0 ? ("Dogão Personalizado") : ("Dogão Completo")} </h4>
                  <p className="text-sm text-gray-500">
                    {item.removedIngredients.length > 0 ? (`Sem: ${item.removedIngredients.join(', ')}`) : ""}
                  </p>
                </div>
              </div>

              {/* Controle de Quantidade */}
              <div className="flex items-center space-x-4 pl-2">
                <span className="font-semibold hidden sm:inline">{formatCurrency(PRICE_PER_DOG)}</span>
                
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-700"
                    onClick={() => handleDecrement(item.groupId)} // Decrementa
                    disabled={item.quantity <= 1 || isLoading}
                  >
                    -
                  </Button>
                  
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-green-600"
                    onClick={() => handleIncrement(item.groupId)} // Incrementa
                    disabled={isLoading}
                  >
                    +
                  </Button>
                </div>
                
                {/* Botão de Lixo para remover o grupo todo */}
                <Button variant="ghost" size="icon" onClick={() => handleRemoveGroup(item.groupId)} disabled={isLoading}>
                  <Trash2 className="size-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700" disabled={isLoading}>
          <PlusCircle className="mr-2" />
          {orderItems.length === 0 ? 'Adicionar Dogão' : 'Adicionar outro Dogão'}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total ({orderItems.length} Dogões):</span>
          <span>{formatCurrency(totalValue)}</span>
        </div>
      </div>

      <Button
        className="w-full bg-orange-600 hover:bg-orange-700"
        onClick={handleProccessItems}
        disabled={orderItems.length === 0 || isLoading}
      >
        {isLoading ? 'Salvando...' : 'Continuar'}
      </Button>
      <HotDogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomization} // Salva apenas UM item
      />
    </div>
  );
}