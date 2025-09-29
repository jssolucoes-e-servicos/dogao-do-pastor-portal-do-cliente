"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidCPF } from "@/helpers";
import { IPresaleStartResponse, ISeller } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CPFFormProps { sellerId: string, seller: ISeller | null }

export function PreOrderCPFForm({ sellerId, seller }: CPFFormProps) {
  const router = useRouter();
  const [cpf, setCpf] = useState<string>('84005017053');
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    toast(!seller ? 'Continuando sem vendedor.' : `Vendedor: ${seller.name}`);
  }, [seller]);

  const handleCpfSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isValidCPF(cpf)) {
      toast.error('CPF Inválido. Por favor, digite um CPF válido.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pre-sale/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, sellerId }),
      });
      const data: IPresaleStartResponse = await response.json();
      console.log('data:', data);
      if (!response.ok || !data?.presale) {
        router.push("/off-line");
      } else {
        router.push(`/pre-venda/${data.presale.id}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Ocorreu um erro ao buscar seus dados. Tente novamente.');
    } finally {
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
