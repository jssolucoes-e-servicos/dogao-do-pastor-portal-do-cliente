"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidCPF } from "@/helpers";
import { ISeller } from "@/interfaces";
import { IOrderOnlineStartResponse } from "@/interfaces/find-order-online.interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CPFFormProps { sellerId: string, sellerTag:string, seller: ISeller | null }

export function PreOrderCPFForm({ sellerId,sellerTag, seller }: CPFFormProps) {
  const router = useRouter();
  const [cpf, setCpf] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    toast(!seller ? 'Continuando sem vendedor.' : `Vendedor: ${seller.name}`);
  }, [seller]);

  const handleCpfSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cpfNumbersOnly = cpf.replace(/\D/g, '');
    if (!isValidCPF(cpfNumbersOnly)) {
      toast.error('CPF Inválido. Por favor, digite um CPF válido.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-online/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf: cpfNumbersOnly, sellerTag, sellerId }),
      });
      const data: IOrderOnlineStartResponse = await response.json();

      console.log('cpf: ', data);
      
      if (!response.ok || !data?.presale) {
        router.push("/off-line");
        setIsLoading(false);
      } else {
        router.push(`/comprar/${data.presale.id}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Ocorreu um erro ao buscar seus dados. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCpfSearch} className="space-y-6 min-w-max">
      <h2 className="text-2xl font-bold text-center">Inicie seu Pedido</h2>
      <div>
        <Label htmlFor="cpf" className='pb-2'>Seu CPF</Label>
        <Input
          id="cpf"
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite apenas números"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={isLoading}
      >
        {isLoading ? 'Buscando...' : 'Iniciar Pedido'}
      </Button>
    </form>
  );
}
